import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`chaos-surface rounded-lg p-5 shadow-glow ${className}`}>
      {children}
    </section>
  );
}
