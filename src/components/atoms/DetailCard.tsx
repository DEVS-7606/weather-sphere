import type { ReactNode } from "react";

export default function DetailCard({
  label,
  children,
  compact = false,
}: {
  label: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl flex flex-col bg-surface-high hover:bg-surface-bright transition-colors duration-400 ${compact ? "p-3 min-h-25" : "p-4 sm:p-5 min-h-35"}`}
    >
      <p
        className={`uppercase tracking-label text-on-surface-variant font-medium ${compact ? "text-3xs mb-2" : "text-2xs mb-3"}`}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
