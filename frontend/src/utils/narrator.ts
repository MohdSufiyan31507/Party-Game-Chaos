const narratorLines = [
  "Welcome back, legends.",
  "Things are about to get chaotic.",
  "Maximum Chaos Activated!",
  "Main Character Energy unlocked.",
  "Red Team has entered villain mode.",
  "Someone check on Blue Team.",
  "That answer was bold... sadly wrong.",
  "Blue Team is cooking!",
];

export function narratorFor(seed: string) {
  const index = seed
    .split("")
    .reduce((total, letter) => total + letter.charCodeAt(0), 0);

  return narratorLines[index % narratorLines.length];
}
