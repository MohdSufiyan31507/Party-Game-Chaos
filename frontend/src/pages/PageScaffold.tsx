import type { ReactNode } from "react";
import { PageTransition } from "../components/ui/PageTransition";
import { Panel } from "../components/ui/Panel";
import { narratorFor } from "../utils/narrator";

export function PageScaffold({
  title,
  eyebrow = "Chaos Console",
  subtitle,
  children,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <PageTransition className="space-y-6">
      <section className="relative overflow-hidden py-2 sm:py-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <p className="show-chip inline-flex rounded-md border border-surge/25 bg-surge/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-surge">
            {eyebrow}
          </p>
          <span className="show-chip inline-flex rounded-md border border-flare/25 bg-flare/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-flare">
            Live Stage
          </span>
        </div>
        <h1 className="show-title mt-3 text-4xl font-black leading-none sm:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/64 sm:text-lg sm:leading-8">
          {subtitle ?? narratorFor(title)}
        </p>
      </section>
      {children ?? (
        <Panel>
          <p className="text-white/68">
            This screen is ready. Choose an action to keep the chaos moving.
          </p>
        </Panel>
      )}
    </PageTransition>
  );
}
