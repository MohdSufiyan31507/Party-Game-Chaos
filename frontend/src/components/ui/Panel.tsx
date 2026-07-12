import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`chaos-surface show-panel rounded-lg p-4 shadow-glow transition duration-200 sm:p-5 ${className}`}>
      {children}
    </section>
  );
}
