"use client";

import { useState, useTransition, useEffect } from "react";
import {
  CateringRequestRow,
  CateringRequestStatus,
  updateCateringRequestStatus,
} from "@/app/actions/catering";
import {
  Calendar,
  Users,
  Phone,
  User,
  FileText,
  ChevronDown,
} from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  new: { label: "New", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  contacted: { label: "Contacted", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  confirmed: { label: "Confirmed", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

function timeAgo(dateStr: string, now: Date) {
  const diff = now.getTime() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function StatusDropdown({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.new;

  const handleChange = (newStatus: CateringRequestStatus) => {
    setOpen(false);
    setStatus(newStatus);
    startTransition(async () => {
      await updateCateringRequestStatus(requestId, newStatus);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${config.bg} ${config.color} ${isPending ? "opacity-50" : "hover:shadow-sm"}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {config.label}
        <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[140px] py-1 overflow-hidden">
            {(Object.keys(STATUS_CONFIG) as CateringRequestStatus[]).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => handleChange(s)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 ${
                    s === status ? "font-bold bg-gray-50" : ""
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      STATUS_CONFIG[s].color
                    }`}
                    style={{ backgroundColor: "currentColor" }}
                  />
                  {STATUS_CONFIG[s].label}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function CateringRequestsTable({
  requests,
}: {
  requests: CateringRequestRow[];
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 text-center">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FileText size={24} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm font-medium">
          No catering event requests yet.
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Requests submitted from the catering page will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[1.4fr_1fr_1fr_1.1fr_1.8fr_1fr_120px] gap-4 px-6 py-3.5 bg-gray-100/80 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider">
        <span>Customer</span>
        <span>Event Type</span>
        <span>Guests</span>
        <span>Event Date</span>
        <span>Notes / Special Requirements</span>
        <span>Received</span>
        <span className="text-right">Status</span>
      </div>

      {/* Rows */}
      {requests.map((req) => (
        <div
          key={req.id}
          className="grid grid-cols-[1.4fr_1fr_1fr_1.1fr_1.8fr_1fr_120px] gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50/80 transition-colors items-center text-sm"
        >
          {/* Customer */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#3b1200]/10 flex items-center justify-center text-[#3b1200] shrink-0 font-bold">
              <User size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {req.name}
              </p>
              <p className="text-xs text-gray-600 flex items-center gap-1 truncate font-medium">
                <Phone size={12} className="text-gray-400" />
                {req.phone}
              </p>
              {req.email && (
                <p className="text-xs text-gray-400 truncate">{req.email}</p>
              )}
            </div>
          </div>

          {/* Event Type */}
          <div className="text-sm text-gray-900 font-semibold">{req.event_type}</div>

          {/* Guests */}
          <div className="flex items-center gap-1.5 text-sm text-gray-800 font-medium">
            <Users size={15} className="text-gray-500" />
            {req.guest_count}
          </div>

          {/* Event Date */}
          <div className="flex items-center gap-1.5 text-sm text-gray-900 font-medium">
            <Calendar size={15} className="text-gray-500" />
            {req.event_date
              ? new Date(req.event_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Not set"}
          </div>

          {/* Special Requirements / Notes */}
          <div>
            {req.notes ? (
              <div className="bg-amber-50 border border-amber-300 text-amber-950 rounded-lg p-2.5 text-xs font-medium leading-relaxed">
                <span className="font-bold text-amber-950 block text-[10px] uppercase tracking-wider mb-0.5">
                  Customer Note:
                </span>
                {req.notes}
              </div>
            ) : (
              <span className="text-gray-400 italic text-xs">No extra notes</span>
            )}
          </div>

          {/* Time ago */}
          <div className="text-xs text-gray-500 font-medium" suppressHydrationWarning>{timeAgo(req.created_at, now)}</div>

          {/* Status Dropdown */}
          <div className="flex justify-end">
            <StatusDropdown requestId={req.id} currentStatus={req.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
