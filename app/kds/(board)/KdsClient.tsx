"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { KdsOrder, updateKdsOrderStatus, logoutKds } from "@/app/actions/kds";
import { supabase } from "@/backend/supabase";
import {
  Clock,
  ChefHat,
  CheckCircle2,
  User,
  Phone,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function parseOrderDate(dateString: string) {
  return new Date(dateString);
}

function formatTimeElapsed(createdAt: string, now: Date) {
  const diff = Math.max(0, now.getTime() - parseOrderDate(createdAt).getTime());
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// ── Ticket ────────────────────────────────────────────────────────────────────

function KdsTicket({
  order,
  now,
  onMarkReady,
  isRemoving,
}: {
  order: KdsOrder;
  now: Date;
  onMarkReady: (id: string) => void;
  isRemoving: boolean;
}) {
  const elapsedMins = Math.floor(
    (now.getTime() - parseOrderDate(order.created_at).getTime()) / 60000
  );
  const isDelayed = elapsedMins >= 15;

  const headerBg = isDelayed ? "bg-red-800" : "bg-emerald-800";

  return (
    <div
      className={`
        flex flex-col h-full rounded-2xl overflow-hidden
        border border-slate-700/80 bg-slate-800 shadow-2xl
        transition-all duration-500 ease-in-out
        ${isRemoving ? "opacity-0 scale-90 translate-y-4" : "opacity-100 scale-100 translate-y-0"}
      `}
    >
      {/* ── header ── */}
      <div className={`flex justify-between items-center px-5 py-3.5 ${headerBg}`}>
        <div>
          <div className="font-extrabold text-2xl text-white tracking-tight">
            #{order.order_number}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 mt-0.5">
            {order.order_type}
          </div>
        </div>
        <div
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-xl
            font-mono text-xl font-bold bg-black/30 text-white
            ${isDelayed ? "animate-pulse" : ""}
          `}
        >
          <Clock size={16} />
          <span suppressHydrationWarning>{formatTimeElapsed(order.created_at, now)}</span>
        </div>
      </div>

      {/* ── customer bar ── */}
      <div className="flex items-center gap-4 px-5 py-2.5 border-b border-slate-700/60 bg-slate-800/80 text-sm text-slate-300">
        <div className="flex items-center gap-1.5">
          <User size={13} className="text-slate-500" />
          <span className="font-semibold truncate max-w-[140px]">{order.customer_name}</span>
        </div>
        {order.phone && (
          <div className="flex items-center gap-1.5 text-slate-500">
            <Phone size={13} />
            <span>{order.phone}</span>
          </div>
        )}
      </div>

      {/* ── items ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {order.order_items?.length > 0 ? (
          order.order_items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2.5 border-b border-slate-700/40 last:border-0"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center font-black text-lg text-white shrink-0">
                {item.quantity}
              </div>
              <p className="font-semibold text-lg leading-snug text-slate-100">
                {item.item_name}
              </p>
            </div>
          ))
        ) : (
          <div className="text-slate-500 italic text-center py-6 text-sm">
            No items listed
          </div>
        )}
      </div>

      {/* ── bump button — only Mark Ready ── */}
      <div className="p-3 pt-2 bg-slate-900/80 border-t border-slate-700/60">
        <button
          onClick={() => onMarkReady(order.id)}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-extrabold text-base uppercase tracking-wider transition-all duration-150 select-none bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white"
        >
          <CheckCircle2 size={22} />
          Mark Ready
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function KdsClient({ initialOrders }: { initialOrders: KdsOrder[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const [now, setNow] = useState(new Date());
  const [orders, setOrders] = useState<KdsOrder[]>(initialOrders);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const prevOrderCountRef = useRef(initialOrders.length);

  const playAlertSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBeep = (time: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
        osc.start(time);
        osc.stop(time + 0.35);
      };
      playBeep(ctx.currentTime, 880);
      playBeep(ctx.currentTime + 0.15, 1100);
      playBeep(ctx.currentTime + 0.3, 1320);
    } catch {}
  };

  // Fetch fresh cooking orders directly from the API (no page reload)
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/kds/orders", { cache: "no-store" });
      if (res.ok) {
        const data: KdsOrder[] = await res.json();
        setOrders((prev) => {
          if (data.length > prevOrderCountRef.current) {
            playAlertSound();
          }
          prevOrderCountRef.current = data.length;
          return data;
        });
      }
    } catch {}
  }, []);

  // 1-second clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Realtime sync + 3-second auto-poll (ensures orders show in real time without refreshing tab)
  useEffect(() => {
    fetchOrders();

    // 3-second poll loop as reliable fallback
    const pollInterval = setInterval(fetchOrders, 3000);

    // Supabase Realtime WebSocket listener
    const channel = supabase
      .channel("kds:orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  // Scroll state for arrows
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", updateScrollState); ro.disconnect(); };
  }, [orders]);

  // Auto-scroll every 8s
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const tick = () => {
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + 360, behavior: "smooth" });
    };
    autoScrollRef.current = setInterval(tick, 8000);
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  }, [orders.length]);

  const pauseAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + 360, behavior: "smooth" });
    }, 8000);
  };

  const scroll = (dir: "left" | "right") => {
    pauseAutoScroll();
    scrollRef.current?.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" });
  };

  // Optimistic mark-ready: animate out → remove locally → call server → re-fetch to confirm sync
  const handleMarkReady = (orderId: string) => {
    setRemovingIds((s) => new Set(s).add(orderId));
    setTimeout(async () => {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setRemovingIds((s) => { const n = new Set(s); n.delete(orderId); return n; });
      await updateKdsOrderStatus(orderId, "ready");
      // Re-fetch to make sure we're in perfect sync with the DB
      fetchOrders();
    }, 450);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden select-none">

      {/* ── Header ── */}
      <header className="flex justify-between items-center px-6 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <ChefHat className="text-emerald-400" size={28} />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight leading-none">Kitchen Display</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">All orders here are confirmed by operator</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{orders.length} Cooking</span>
          </div>
          <div className="h-5 w-px bg-slate-700" />
          <div className="text-slate-400 font-mono text-sm" suppressHydrationWarning>
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <form action={logoutKds}>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <LogOut size={13} />
              Lock
            </button>
          </form>
        </div>
      </header>

      {/* ── Board ── */}
      <main className="flex-1 relative overflow-hidden bg-slate-950">
        {orders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
            <CheckCircle2 size={64} className="opacity-40" />
            <h2 className="text-2xl font-bold text-slate-500">Kitchen is clear!</h2>
            <p className="text-slate-600 text-sm">Waiting for operator to confirm orders…</p>
          </div>
        ) : (
          <>
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 shadow-xl transition-all backdrop-blur"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 shadow-xl transition-all backdrop-blur"
              >
                <ChevronRight size={22} />
              </button>
            )}

            <div
              ref={scrollRef}
              onPointerDown={pauseAutoScroll}
              className="h-full flex gap-5 px-6 py-5 overflow-x-auto overflow-y-hidden"
              style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
            >
              <style>{`div::-webkit-scrollbar { display: none; }`}</style>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="shrink-0 w-[340px] h-full"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <KdsTicket
                    order={order}
                    now={now}
                    onMarkReady={handleMarkReady}
                    isRemoving={removingIds.has(order.id)}
                  />
                </div>
              ))}
            </div>

            {orders.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {orders.map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
