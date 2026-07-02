import type { ReactNode } from "react";

type StatusNoteTone = "info" | "warn" | "success";

const tones: Record<StatusNoteTone, string> = {
  info: "border-surge/25 bg-surge/10 text-surge",
  warn: "border-flare/25 bg-flare/10 text-flare",
  success: "border-lime/25 bg-lime/10 text-lime",
};

export function StatusNote({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: StatusNoteTone;
}) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm font-bold leading-6 ${tones[tone]}`}>
      {children}
    </div>
  );
}
