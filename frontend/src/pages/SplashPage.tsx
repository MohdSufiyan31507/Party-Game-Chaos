import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import gameImage from "../assets/chaos-ka-adda-game-image.png";

export function SplashPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4 text-center text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(32,217,255,0.26),transparent_30%),radial-gradient(circle_at_70%_70%,rgba(255,63,143,0.28),transparent_32%),linear-gradient(135deg,#070817,#18133A)]" />
      <div className="page-grid absolute inset-0 bg-grid opacity-40" />
      <motion.section
        className="relative z-10 max-w-4xl py-8"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <img
          src={gameImage}
          alt="Chaos Ka Adda genie mascot holding chaos cards"
          className="mx-auto mb-6 h-64 w-64 rounded-lg object-contain drop-shadow-[0_0_42px_rgba(182,55,255,0.45)] sm:h-80 sm:w-80"
        />
        <p className="text-sm font-black uppercase tracking-[0.38em] text-white/55">
          Presented by
        </p>
        <p className="mt-4 text-2xl font-black uppercase tracking-[0.24em] text-surge sm:text-4xl">
          The Chaos Games
        </p>
        <h1 className="sr-only">
          Chaos Ka Adda
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/68">
          Meet the genie mascot of the Adda, your chaos dealer for rooms, teams,
          chaos cards, scoring drama, and post-2000 pop-culture games.
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
