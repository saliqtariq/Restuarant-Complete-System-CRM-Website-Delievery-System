"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * A thin progress bar that appears at the top of the screen
 * whenever a route change is in-flight, giving immediate visual feedback.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      // Route has finished — complete the bar
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  // Kick off the bar on link click using a global click handler
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/dashboard")) return;
      if (href === pathname) return;

      // Start the fake progress bar
      setVisible(true);
      setProgress(15);

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 85) {
            clearInterval(intervalRef.current!);
            return 85; // hold at 85% until route resolves
          }
          return p + Math.random() * 8;
        });
      }, 300);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #E63946, #ff6b6b)",
          borderRadius: "0 2px 2px 0",
          transition: "width 0.3s ease, opacity 0.4s ease",
          boxShadow: "0 0 10px rgba(230, 57, 70, 0.5)",
          opacity: progress >= 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
