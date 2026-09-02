"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";

function NavChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export const navTriggerClass =
  "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 break-keep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

interface HeaderNavDropdownProps {
  label: ReactNode;
  triggerClassName?: string;
  panelClassName?: string;
  align?: "left" | "right";
  children: ReactNode;
}

export function HeaderNavDropdown({
  label,
  triggerClassName,
  panelClassName,
  align = "left",
  children,
}: HeaderNavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, [clearCloseTimer]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      onMouseEnter={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={cn(navTriggerClass, triggerClassName)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <NavChevron open={open} />
      </button>
      <div
        id={panelId}
        role="menu"
        aria-hidden={!open}
        className={cn(
          "absolute top-full z-50 mt-1 max-w-[calc(100vw-2rem)] rounded-xl border border-surface-200 bg-white p-2 shadow-lg transition-opacity",
          align === "right" ? "right-0" : "left-0",
          !open && "pointer-events-none invisible opacity-0",
          panelClassName,
        )}
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleClose}
      >
        {children}
      </div>
    </div>
  );
}

export function useDismissOnOutsideClick(ref: RefObject<HTMLDivElement | null>, onClose: () => void) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose]);
}
