import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { ChaosCardLogo } from "../components/ui/ChaosCardLogo";

const promptCards = ["Act", "Guess", "Roast", "Buzz"];

export function SplashPage() {
  return (
    <main className="dark-stage relative grid min-h-screen place-items-center overflow-hidden bg-[#070817] px-4 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(32,217,255,0.26),transparent_28%),radial-gradient(circle_at_76%_22%,rgba(255,203,77,0.18),transparent_26%),radial-gradient(circle_at_52%_82%,rgba(255,63,143,0.26),transparent_32%),linear-gradient(135deg,#070817,#18133A_58%,#25112A)]" />
      <div className="page-grid absolute inset-0 bg-grid opacity-40" />
      <motion.section
        className="relative z-10 grid w-full max-w-6xl gap-10 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-3 rounded-lg border border-surge/30 bg-surge/10 px-3 py-2 text-surge shadow-glow">
            <ChaosCardLogo size={34} />
            <span className="stage-eyebrow text-xs font-black uppercase tracking-[0.26em]">
              The Chaos Games
            </span>
          </div>
          <h1 className="show-title mt-7 max-w-4xl text-5xl font-black leading-[1.16] sm:text-7xl">
            Chaos Ka Adda
          </h1>
          <p className="stage-copy mt-5 max-w-2xl text-lg leading-8">
            A loud little party arena for team battles, prompt cards, fast guesses,
            and score drama that feels like a game-show night.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button to="/landing" icon={Sparkles} tone="pink">
              Enter Adda
            </Button>
          </div>
        </div>

        <div className="relative mx-auto grid min-h-[360px] w-full max-w-md place-items-center">
          <div className="absolute inset-8 rounded-full border border-surge/20 bg-surge/10 blur-3xl" />
          <motion.div
            className="relative grid size-44 place-items-center rounded-lg border border-flare/35 bg-flare/10 text-flare shadow-hot"
            animate={{ rotate: [-2, 2, -2], y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChaosCardLogo size={112} />
          </motion.div>
          {promptCards.map((card, index) => (
            <motion.div
              key={card}
              className="absolute rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white shadow-glow backdrop-blur-xl"
              style={{
                left: index % 2 === 0 ? "2%" : "auto",
                right: index % 2 === 1 ? "2%" : "auto",
                top: `${12 + index * 19}%`,
              }}
              animate={{ y: [0, index % 2 === 0 ? 10 : -10, 0], rotate: [0, index % 2 === 0 ? -4 : 4, 0] }}
              transition={{ duration: 3.2 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
            >
              {card}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
