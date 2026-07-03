import { mvpSampleData } from "../sampleData/mvpData";
import type { GameDefinition, GameDifficulty, GameKind, GameStatus } from "../registry/types";

const categories = [
  "Bollywood",
  "Hollywood",
  "Mixed",
  "Disney",
  "TV Shows",
  "Web Series",
  "Sports",
  "Memes",
  "General Knowledge",
  "Internet Culture",
];

const scoringRules = {
  correct: 10,
  fastBonus: 5,
  skip: 0,
  wrong: 0,
};

const playableKinds: Record<string, GameKind> = {
  "guess-movie": "clue",
  "dumb-charades": "acting",
  "heads-up": "heads_up",
  "rapid-fire": "rapid_fire",
  "emoji-challenge": "emoji",
};

function createGame(
  id: string,
  name: string,
  description: string,
  difficulty: GameDifficulty,
  status: GameStatus,
): GameDefinition {
  return {
    id,
    name,
    description,
    rules:
      status === "MVP"
        ? ["Use the on-screen prompt.", "Host taps Correct or Skip.", "Score as many as possible."]
        : ["Game plan is ready.", "Full live mode can plug in later."],
    tutorial:
      status === "MVP"
        ? ["Pick the game.", "Start the live room round.", "Use Correct/Skip to cycle prompts."]
        : ["This game has architecture, metadata, and sample data ready for future live expansion."],
    categories,
    supportedModes: ["free_for_all", "team_vs_team"],
    scoringRules,
    difficulty,
    status,
    kind: playableKinds[id] ?? "placeholder",
    sampleData:
      mvpSampleData[id] ?? [
        {
          prompt: `${name} sample prompt`,
          answer: `${name} sample answer`,
          helperText: "Future game preview. The live version can be added without changing the game library.",
        },
      ],
  };
}

export const gameMetadata: GameDefinition[] = [
  createGame("dumb-charades", "Dumb Charades", "Act it out while your team loses all dignity responsibly.", "Medium", "MVP"),
  createGame("reverse-charades", "Reverse Charades", "The team acts together while one brave guesser panics.", "Medium", "Placeholder"),
  createGame("heads-up", "Heads Up", "Forehead mode with tilt-ready architecture and fallback buttons.", "Medium", "MVP"),
  createGame("guess-movie", "Guess the Movie", "Decode clues, fake posters, and dramatic one-liners.", "Chill", "MVP"),
  createGame("guess-song", "Guess the Song", "Text clues and hummable chaos without copyrighted audio.", "Medium", "Placeholder"),
  createGame("guess-animal", "Guess the Animal", "Clues, impressions, and questionable biology confidence.", "Chill", "Placeholder"),
  createGame("guess-celebrity", "Guess the Celebrity", "Guess the famous-ish person from fake-safe clues.", "Medium", "Placeholder"),
  createGame("guess-logo", "Guess the Logo", "Text logo clues without real brand artwork.", "Chill", "Placeholder"),
  createGame("guess-brand", "Guess the Brand", "Brand-style riddles using text-only sample clues.", "Medium", "Placeholder"),
  createGame("guess-flag", "Guess the Flag", "Flag facts and color clues for quick guesses.", "Chill", "Placeholder"),
  createGame("guess-country", "Guess the Country", "Culture, map, and food clues without getting too serious.", "Medium", "Placeholder"),
  createGame("guess-monument", "Guess the Monument", "Landmark hints for travel-brained teams.", "Medium", "Placeholder"),
  createGame("guess-car", "Guess the Car", "Text clues for car fans and confident bluffers.", "Medium", "Placeholder"),
  createGame("guess-superhero", "Guess the Superhero", "Power clues, origin hints, and cape-adjacent drama.", "Chill", "Placeholder"),
  createGame("emoji-challenge", "Emoji Challenge", "Tiny emoji-style puzzles pretending to be cinema.", "Chill", "MVP"),
  createGame("pictionary", "Pictionary", "Draw the clue while everyone politely yells.", "Medium", "Placeholder"),
  createGame("rapid-fire", "Rapid Fire", "Answer fast before the timer starts judging you.", "Chaos", "MVP"),
  createGame("word-association", "Word Association", "Say the first connected word before your brain buffers.", "Chill", "Placeholder"),
  createGame("story-builder", "Story Builder", "Build a story one chaotic sentence at a time.", "Medium", "Placeholder"),
  createGame("finish-dialogue", "Finish the Dialogue", "Complete sample fake dialogues with maximum drama.", "Medium", "Placeholder"),
  createGame("finish-lyrics", "Finish the Lyrics", "Lyric-style prompts using original sample lines only.", "Medium", "Placeholder"),
  createGame("truth-or-dare", "Truth or Dare", "Spicy-but-safe prompts for brave people and louder friends.", "Medium", "Placeholder"),
  createGame("never-have-i-ever", "Never Have I Ever", "Safe party prompts with spicy energy and no bad vibes.", "Chill", "Placeholder"),
  createGame("would-you-rather", "Would You Rather", "Impossible choices designed to start arguments for fun.", "Chill", "Placeholder"),
  createGame("this-or-that", "This or That", "Fast preference battles with zero time for speeches.", "Chill", "Placeholder"),
  createGame("two-truths-one-lie", "Two Truths and One Lie", "Bluff, detect, and expose suspiciously specific friends.", "Medium", "Placeholder"),
  createGame("mafia", "Mafia", "Social deduction shell for a later advanced mode.", "Chaos", "Placeholder"),
  createGame("werewolf", "Werewolf", "Night phase drama planned for the advanced engine.", "Chaos", "Placeholder"),
  createGame("meme-challenge", "Meme Challenge", "Make the room laugh. No pressure, obviously.", "Chaos", "Placeholder"),
  createGame("guess-sound", "Guess the Sound", "Text-described sounds for now, real audio later.", "Medium", "Placeholder"),
  createGame("guess-voice", "Guess the Voice", "Voice-style clues without impersonation assets.", "Medium", "Placeholder"),
  createGame("speed-quiz", "Speed Quiz", "Rapid trivia rounds with tiny thinking windows.", "Chaos", "Placeholder"),
  createGame("spin-wheel", "Spin the Wheel", "Random mini-challenges for later chaos phases.", "Chaos", "Placeholder"),
  createGame("roast-battle", "Roast Battle", "Safe roast prompts with boundaries built in.", "Chaos", "Placeholder"),
  createGame("secret-mission", "Secret Mission", "Sneaky objectives hidden inside the party.", "Chaos", "Placeholder"),
];

export const gameCategories = categories;
