import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`chaos-surface rounded-lg p-4 shadow-glow sm:p-5 ${className}`}>
      {children}
    </section>
  );
}
