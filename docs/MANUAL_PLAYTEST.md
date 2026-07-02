# Chaos Ka Adda Manual Playtest

Use two browser windows or two devices: one host and one guest.

## Setup

1. Start MongoDB locally.
2. Start backend:

```powershell
cd "C:\Users\SAMSUNG\Desktop\Chaos Pressents"
$env:JWT_SECRET="your-local-long-secret"
npm.cmd run dev:backend
```

3. Start frontend:

```powershell
cd "C:\Users\SAMSUNG\Desktop\Chaos Pressents"
npm.cmd run dev
```

4. Open `http://127.0.0.1:5173`.

## Host Flow

1. Signup, login, or use Guest Login.
2. Go to Create Room.
3. Create a room and copy the room code.
4. Confirm lobby shows `Realtime: online`.
5. Wait for the guest to join.
6. Start setup.
7. Randomize teams.
8. Lock teams.
9. Select a game.
10. Select a category.
11. Start game.
12. Use Correct and Skip.
13. Let timer expire or press End Round.
14. On Round Result, start Next Round or Show Scores.
15. On room leaderboard, Finish Game.
16. Confirm Final Winner says the winning team is cooking and loser got cooked.

## Guest Flow

1. Signup, login, or use Guest Login in another browser window.
2. Join Room using the host's code.
3. Confirm lobby updates without refreshing.
4. Wait while host starts setup.
5. Confirm teams update when host randomizes/locks.
6. Confirm game/category selections update.
7. Confirm gameplay card and score update when host taps Correct or Skip.
8. Confirm time-up moves to Round Result.
9. Confirm Final Winner shows the same result as host.

## Refresh Recovery

Check these pages by refreshing the browser:

1. Lobby route: `/lobby/:code`
2. Team Setup route: `/teams/:code`
3. Gameplay route: `/play/:code`
4. Round Result route: `/round-result/:code`
5. Final Winner route: `/winner/:code`

Expected result: the app reloads the active room from MongoDB after auth finishes.

## Profile And Store

1. After finishing a game, open Profile.
2. Confirm recent games appear.
3. Open Statistics.
4. Confirm games played, wins/losses, score, and XP reflect progress.
5. Open Store.
6. Buy an affordable item.
7. Confirm coins decrease and item becomes owned.
8. Open Achievements.
9. Confirm earned achievements appear.
