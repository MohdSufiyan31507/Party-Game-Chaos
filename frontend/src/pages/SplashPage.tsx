import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";

export function SplashPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4 text-center text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(32,217,255,0.26),transparent_30%),radial-gradient(circle_at_70%_70%,rgba(255,63,143,0.28),transparent_32%),linear-gradient(135deg,#070817,#18133A)]" />
      <div className="page-grid absolute inset-0 bg-grid opacity-40" />
      <motion.section
        className="relative z-10 max-w-4xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="mx-auto mb-8 grid size-20 place-items-center rounded-lg border border-surge/40 bg-surge/15 text-surge shadow-glow">
          <Sparkles size={38} aria-hidden="true" />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.38em] text-white/55">
          Presented by
        </p>
        <h1 className="mt-4 text-5xl font-black leading-none sm:text-8xl">
          The Chaos Games
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/68">
          Chaos Ka Adda is a neon local mock party platform shell.
        </p>
        <div className="mt-9 flex justify-center">
          <Button to="/landing" icon={Sparkles} tone="pink">
            Enter Adda
          </Button>
        </div>
      </motion.section>
    </main>
  );
}
