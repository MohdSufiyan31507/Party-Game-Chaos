import { LogIn, Play, UserPlus } from "lucide-react";
import { Button } from "../components/ui/Button";
import { PageTransition } from "../components/ui/PageTransition";

export function LandingPage() {
  return (
    <PageTransition className="dark-stage min-h-screen bg-[#070817] text-white">
      <section className="relative grid min-h-screen content-center overflow-hidden px-4 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(182,55,255,0.32),transparent_28%),radial-gradient(circle_at_78%_12%,rgba(255,157,46,0.20),transparent_30%),linear-gradient(135deg,#070817,#15113A_55%,#25112A)]" />
        <div className="page-grid absolute inset-0 bg-grid opacity-45" />
        <div className="relative mx-auto w-full max-w-6xl">
          <p className="stage-eyebrow text-xs font-black uppercase tracking-[0.32em]">
            Chaos Ka Adda
          </p>
          <h1 className="stage-title mt-5 max-w-4xl text-5xl font-black leading-none sm:text-7xl lg:text-8xl">
            Party games with score drama and neon nonsense.
          </h1>
          <p className="stage-copy mt-6 max-w-2xl text-lg leading-8">
            Live multiplayer rooms, guest runs, account login, team-vs-team scoring,
            and realtime party game chaos.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button to="/guest" icon={Play} tone="cyan">Quick Guest</Button>
            <Button to="/login" icon={LogIn} tone="pink">Login</Button>
            <Button to="/signup" icon={UserPlus} tone="orange">Signup</Button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
