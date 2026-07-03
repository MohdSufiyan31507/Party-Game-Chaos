export type GamePrompt = {
  prompt: string;
  answer: string;
  helperText: string;
};

export const playableGameIds = [
  "guess-movie",
  "dumb-charades",
  "heads-up",
  "rapid-fire",
  "emoji-challenge",
];

export const gamePrompts: Record<string, GamePrompt[]> = {
  "guess-movie": [
    {
      prompt: "Three engineering students, one strict system, and a message that success should chase excellence.",
      answer: "3 Idiots",
      helperText: "Post-2000 blockbuster clue. Close answers count.",
    },
    {
      prompt: "A rebel warrior, a fearless officer, and a dance face-off that took over the internet.",
      answer: "RRR",
      helperText: "Global post-2000 movie clue.",
    },
    {
      prompt: "A father trains his daughters to wrestle, and the world cheers for the underdogs.",
      answer: "Dangal",
      helperText: "Sports drama clue.",
    },
    {
      prompt: "A kingdom asks one question for years: why did the loyal warrior do it?",
      answer: "Baahubali 2: The Conclusion",
      helperText: "Pan-India blockbuster clue.",
    },
    {
      prompt: "A gold mine, a violent empire, and a hero whose name became a mass moment.",
      answer: "KGF: Chapter 2",
      helperText: "Mass-action movie clue.",
    },
    {
      prompt: "A spy returns with style, globe-trotting action, and a comeback everyone talked about.",
      answer: "Pathaan",
      helperText: "Recent Bollywood blockbuster clue.",
    },
    {
      prompt: "Dreams inside dreams, a spinning top, and a team stealing secrets from the mind.",
      answer: "Inception",
      helperText: "Mind-bending Hollywood clue.",
    },
    {
      prompt: "Blue aliens, a glowing planet, and a box-office universe that became impossible to ignore.",
      answer: "Avatar",
      helperText: "Global sci-fi blockbuster clue.",
    },
    {
      prompt: "A snap, time travel, portals, and one of the biggest finales in superhero history.",
      answer: "Avengers: Endgame",
      helperText: "Marvel movie clue.",
    },
    {
      prompt: "A doll leaves a perfect pink world and starts an existential crisis.",
      answer: "Barbie",
      helperText: "Recent global pop-culture movie clue.",
    },
    {
      prompt: "A scientist, a secret project, and a black-and-white moral fallout.",
      answer: "Oppenheimer",
      helperText: "Recent awards-season movie clue.",
    },
    {
      prompt: "A poor family, a rich house, and a plan that spirals into a global conversation.",
      answer: "Parasite",
      helperText: "International cinema clue.",
    },
  ],
  "dumb-charades": [
    {
      prompt: "Act like the RRR dance face-off is about to decide your entire future.",
      answer: "RRR",
      helperText: "No speaking, no spelling, no pointing at text.",
    },
    {
      prompt: "Act like Spider-Man just saw two other Spider-Men walk into the same room.",
      answer: "Spider-Man: No Way Home",
      helperText: "Big expressions. Bigger panic.",
    },
    {
      prompt: "Act like a Marvel hero entering through a portal for the final battle.",
      answer: "Avengers: Endgame",
      helperText: "Silent acting only.",
    },
    {
      prompt: "Act like a student from 3 Idiots explaining that pressure is ruining everyone.",
      answer: "3 Idiots",
      helperText: "No words. Full drama.",
    },
    {
      prompt: "Act like Barbie realizing the real world is not giving dream-house energy.",
      answer: "Barbie",
      helperText: "Show the twist clearly.",
    },
    {
      prompt: "Act like a KGF-style hero walking through smoke while everyone freezes.",
      answer: "KGF: Chapter 2",
      helperText: "Expressions carry the round.",
    },
    {
      prompt: "Act like an Avatar character seeing Pandora for the first time.",
      answer: "Avatar",
      helperText: "Silent meltdown allowed.",
    },
    {
      prompt: "Act like an Oppenheimer scientist realizing the test worked.",
      answer: "Oppenheimer",
      helperText: "No spelling or pointing at letters.",
    },
  ],
  "heads-up": [
    {
      prompt: "Barbenheimer",
      answer: "Barbenheimer",
      helperText: "Team gives clues. Player guesses the pop-culture moment.",
    },
    {
      prompt: "Marvel Multiverse",
      answer: "Marvel Multiverse",
      helperText: "Use movies and characters as clues.",
    },
    {
      prompt: "K-pop Comeback",
      answer: "K-pop Comeback",
      helperText: "Global music/internet culture clue.",
    },
    {
      prompt: "Netflix Binge",
      answer: "Netflix Binge",
      helperText: "Team gives clues without saying the exact words.",
    },
    {
      prompt: "Instagram Reels",
      answer: "Instagram Reels",
      helperText: "Clue it like a situation.",
    },
    {
      prompt: "Anime Arc",
      answer: "Anime Arc",
      helperText: "Panic-based clues are valid.",
    },
    {
      prompt: "World Cup Final",
      answer: "World Cup Final",
      helperText: "Sports culture clue.",
    },
    {
      prompt: "AI Photo Filter",
      answer: "AI Photo Filter",
      helperText: "Internet trend clue.",
    },
  ],
  "rapid-fire": [
    {
      prompt: "Name five globally popular movies released after 2000.",
      answer: "Any five valid post-2000 global hits",
      helperText: "Host judges. No pre-2000 titles.",
    },
    {
      prompt: "Name four Bollywood or Indian blockbusters released after 2000.",
      answer: "Any four valid post-2000 Indian hits",
      helperText: "Fast answers only. Host judges.",
    },
    {
      prompt: "Name five superhero movies released after 2000.",
      answer: "Any five valid superhero movies",
      helperText: "Sequels count if they are real films.",
    },
    {
      prompt: "Name four streaming platforms people actually use.",
      answer: "Any four valid streaming platforms",
      helperText: "Current platforms only.",
    },
    {
      prompt: "Name five artists or groups who made major internet noise after 2010.",
      answer: "Any five valid globally known artists or groups",
      helperText: "Music/pop culture round.",
    },
    {
      prompt: "Name four viral shows from streaming-era pop culture.",
      answer: "Any four valid popular streaming-era shows",
      helperText: "Examples should be widely known.",
    },
    {
      prompt: "Name five movie franchises that stayed relevant after 2000.",
      answer: "Any five valid franchises",
      helperText: "Host decides if the franchise had post-2000 impact.",
    },
    {
      prompt: "Name four Indian actors with major post-2000 blockbuster presence.",
      answer: "Any four valid actors",
      helperText: "Keep the answers moving.",
    },
  ],
  "emoji-challenge": [
    {
      prompt: "Blue people + alien planet + flying creatures",
      answer: "Avatar",
      helperText: "Decode the symbol-style clue. Post-2000 movies only.",
    },
    {
      prompt: "Three friends + engineering college + pressure",
      answer: "3 Idiots",
      helperText: "Say the movie title.",
    },
    {
      prompt: "Infinity stones + portals + final battle",
      answer: "Avengers: Endgame",
      helperText: "Superhero logic is allowed.",
    },
    {
      prompt: "Pink world + doll + real world crisis",
      answer: "Barbie",
      helperText: "Recent global movie clue.",
    },
    {
      prompt: "Gold mine + rocky hero + mass entry",
      answer: "KGF: Chapter 2",
      helperText: "Movie franchise clue.",
    },
    {
      prompt: "Two revolutionaries + dance battle + freedom fight",
      answer: "RRR",
      helperText: "Pan-India/global viral movie clue.",
    },
    {
      prompt: "Scientist + bomb test + moral debate",
      answer: "Oppenheimer",
      helperText: "Awards-season movie clue.",
    },
    {
      prompt: "Poor family + rich house + hidden plan",
      answer: "Parasite",
      helperText: "International hit clue.",
    },
  ],
};

export function isPlayableGame(gameId: string) {
  return playableGameIds.includes(gameId);
}

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
