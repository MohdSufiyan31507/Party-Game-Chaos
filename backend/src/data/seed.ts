process.env.JWT_SECRET ??= "seed-local-placeholder-not-used-for-auth";

async function seed() {
  const [{ connectDatabase }, { RoomModel }, { UserModel }] = await Promise.all([
    import("../config/database.js"),
    import("../models/Room.js"),
    import("../models/User.js"),
  ]);

  const seedUsers = [
    {
      username: "Chaos Champion",
      avatar: "chaos-default",
      level: 7,
      xp: 720,
      coins: 650,
      gamesPlayed: 18,
      wins: 11,
      losses: 7,
      totalScore: 1480,
      achievements: ["Main Character Energy", "Maximum Chaos", "First Purchase"],
      purchases: ["neon-avatar-pack"],
      isGuest: true,
    },
    {
      username: "Neon Nisha",
      avatar: "chaos-default",
      level: 5,
      xp: 510,
      coins: 420,
      gamesPlayed: 13,
      wins: 8,
      losses: 5,
      totalScore: 990,
      achievements: ["Main Character Energy"],
      purchases: [],
      isGuest: true,
    },
    {
      username: "Drama Dev",
      avatar: "chaos-default",
      level: 4,
      xp: 390,
      coins: 310,
      gamesPlayed: 10,
      wins: 4,
      losses: 6,
      totalScore: 720,
      achievements: ["First Game Finished"],
      purchases: ["victory-taunts"],
      isGuest: true,
    },
  ];

  await connectDatabase();
  await UserModel.deleteMany({ username: { $in: seedUsers.map((user) => user.username) } });
  await UserModel.insertMany(seedUsers);
  await RoomModel.deleteMany({ code: /^SEED/ });

  console.log(`Seeded ${seedUsers.length} leaderboard users`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
