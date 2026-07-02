import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-ink text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(255,63,143,0.28),transparent_32%),radial-gradient(circle_at_85%_12%,rgba(77,255,145,0.16),transparent_28%),linear-gradient(135deg,#070817,#17123A)]" />
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8">
        <section className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Link to="/landing" className="inline-flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-lg border border-surge/40 bg-surge/15 text-surge shadow-glow">
                <Sparkles size={24} aria-hidden="true" />
              </span>
              <span className="font-black uppercase tracking-[0.2em] text-white/62">
                The Chaos Games
              </span>
            </Link>
            <h1 className="mt-8 max-w-xl text-5xl font-black leading-none sm:text-7xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/68">
              {subtitle}
            </p>
          </div>
          <div className="chaos-surface rounded-lg p-5 shadow-hot sm:p-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
