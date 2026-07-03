import { Check, RotateCcw, SkipForward } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Panel } from "../../../components/ui/Panel";
import type { GameDefinition } from "../registry/types";

export function GamePlayer({ game }: { game: GameDefinition }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [skips, setSkips] = useState(0);
  const currentCard = game.sampleData[cardIndex % game.sampleData.length];
  const score = correct * game.scoringRules.correct;
  const label = useMemo(() => {
    if (game.kind === "heads_up") return "Forehead Card";
    if (game.kind === "acting") return "Act This";
    if (game.kind === "rapid_fire") return "Rapid Prompt";
    if (game.kind === "emoji") return "Decode This";
    return "Clue";
  }, [game.kind]);

  function nextCard(type: "correct" | "skip") {
    if (type === "correct") setCorrect((value) => value + 1);
    if (type === "skip") setSkips((value) => value + 1);
    setCardIndex((value) => value + 1);
  }

  function reset() {
    setCardIndex(0);
    setCorrect(0);
    setSkips(0);
  }

  if (game.status !== "MVP") {
    return (
      <Panel>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-flare">
          Future Game Preview
        </p>
        <h2 className="mt-3 text-3xl font-black">{game.name}</h2>
        <p className="mt-3 leading-7 text-white/64">{game.sampleData[0].helperText}</p>
      </Panel>
    );
  }

  return (
    <Panel className="text-center">
      <p className="text-xs font-black uppercase tracking-[0.26em] text-surge">
        {label}
      </p>
      <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-6xl">
        {currentCard.prompt}
      </h2>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-white/62">
        {currentCard.helperText}
      </p>
      <p className="mt-4 inline-flex rounded-md border border-lime/25 bg-lime/10 px-3 py-2 text-sm font-black text-lime">
        Answer: {currentCard.answer}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Correct", correct],
          ["Skips", skips],
          ["Score", score],
        ].map(([labelText, value]) => (
          <div key={labelText} className="rounded-lg border border-white/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/42">
              {labelText}
            </p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <Button icon={Check} tone="green" type="button" className="w-full" onClick={() => nextCard("correct")}>
          Correct
        </Button>
        <Button icon={SkipForward} tone="orange" type="button" className="w-full" onClick={() => nextCard("skip")}>
          Skip
        </Button>
        <Button icon={RotateCcw} tone="ghost" type="button" className="w-full" onClick={reset}>
          Reset
        </Button>
      </div>
    </Panel>
  );
}
