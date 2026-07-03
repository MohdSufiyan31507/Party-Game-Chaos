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
      <section className="py-2 sm:py-4">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-surge">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-black leading-none sm:text-6xl">
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
