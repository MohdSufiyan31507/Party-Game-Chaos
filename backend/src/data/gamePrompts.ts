export type GamePrompt = {
  prompt: string;
  answer: string;
  helperText: string;
};

export const gamePrompts: Record<string, GamePrompt[]> = {
  "guess-movie": [
    {
      prompt: "A fake spy, a wedding dance, and one very dramatic suitcase.",
      answer: "Agent Baraati",
      helperText: "Guess the sample movie title from the clue.",
    },
    {
      prompt: "Two rivals, one train, and a very suspicious missing ticket.",
      answer: "Ticket Pe Twist",
      helperText: "Read the clue. Host judges close answers.",
    },
    {
      prompt: "A hero returns after years and everyone pretends not to cry.",
      answer: "The Comeback King",
      helperText: "Dramatic guesses are encouraged.",
    },
  ],
  "dumb-charades": [
    {
      prompt: "Act like a villain entering slow motion.",
      answer: "Villain Entry",
      helperText: "No speaking, no spelling, no pointing at text.",
    },
    {
      prompt: "Act like your phone fell during the final boss fight.",
      answer: "Phone Down Boss Fight",
      helperText: "Big expressions. Bigger panic.",
    },
    {
      prompt: "Act like a celebrity hiding from fans at a mall.",
      answer: "Mall Celebrity Escape",
      helperText: "Silent acting only.",
    },
  ],
  "heads-up": [
    {
      prompt: "Main Character Energy",
      answer: "Main Character Energy",
      helperText: "Team gives clues. Player guesses the card.",
    },
    {
      prompt: "Plot Twist",
      answer: "Plot Twist",
      helperText: "Team gives clues. Player guesses the card.",
    },
    {
      prompt: "Secret Agent",
      answer: "Secret Agent",
      helperText: "Fallback Correct and Skip buttons work now.",
    },
  ],
  "rapid-fire": [
    {
      prompt: "Name five movie genres.",
      answer: "Action, comedy, horror, romance, thriller",
      helperText: "Every valid answer can count.",
    },
    {
      prompt: "Name three fictional detectives.",
      answer: "Any three valid fictional detectives",
      helperText: "Fast answers only.",
    },
    {
      prompt: "Name four things found at a chaotic party.",
      answer: "Snacks, music, friends, confidence",
      helperText: "Host judges valid answers.",
    },
  ],
  "emoji-challenge": [
    {
      prompt: "Lion + crown",
      answer: "The Lion King",
      helperText: "Decode the emoji-style clue.",
    },
    {
      prompt: "Ship + broken heart + ocean",
      answer: "Titanic",
      helperText: "Say the movie/story title.",
    },
    {
      prompt: "Spider + person + city",
      answer: "Spider-Man",
      helperText: "Superhero logic is allowed.",
    },
  ],
};

export function promptsForGame(gameId: string) {
  return (
    gamePrompts[gameId] ?? [
      {
        prompt: `${gameId} sample prompt`,
        answer: `${gameId} sample answer`,
        helperText: "Placeholder gameplay prompt.",
      },
    ]
  );
}
