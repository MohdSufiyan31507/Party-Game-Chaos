# Chaos Ka Adda

Full-stack web rebuild for **Chaos Ka Adda**, presented by **The Chaos Games**.

Milestone 16 is complete: the project now has the frontend foundation, real Express/MongoDB auth, persistent rooms, Socket.IO-powered lobby updates, persisted realtime team setup, room-backed game/category selection, backend-driven gameplay, round timer/result flow, backend-decided final winner, user persistence polish, room recovery, clearer host/guest guidance, manual playtest docs, automated smoke tests, seed tooling, runtime checks, deployment/operations notes, host-ready deployment templates, CI workflow, readiness scripts, production handoff docs, release notes, launch checklist, and local production smoke checks.

## Stack

Frontend:

- React
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Socket.IO client

Backend:

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT auth
- bcrypt-compatible password hashing with `bcryptjs`
- Socket.IO

## No External AI

This project has:

- No Gemini API
- No Google AI SDK
- No external AI API keys
- No external narrator dependency
- No secrets embedded in the repository

Narrator lines are local predefined strings only.

## Environment

Use the example files as references:

- `frontend/.env.example`
- `backend/.env.example`

The backend requires a local `JWT_SECRET` at runtime. Keep real `.env` files private; they are ignored by git.

## Run Frontend

```powershell
cd "C:\Users\SAMSUNG\Desktop\Chaos Pressents"
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Run Backend

Make sure MongoDB is running locally, then create a private `backend/.env` based on `backend/.env.example`.

```powershell
cd "C:\Users\SAMSUNG\Desktop\Chaos Pressents"
npm.cmd run dev:backend
```

API health check:

```text
http://127.0.0.1:4000/api/health
```

## Build

```powershell
npm.cmd run build
npm.cmd run build:backend
```

## Manual Playtest

Follow [docs/MANUAL_PLAYTEST.md](docs/MANUAL_PLAYTEST.md) for the host/guest end-to-end checklist.

## Automated Tests

```powershell
npm.cmd run test
```

This runs backend API smoke tests and the frontend production build.

## Readiness Gate

```powershell
npm.cmd run ready
```

This validates env examples, scans for obvious committed secrets or forbidden AI API references, runs backend smoke tests, and builds the frontend.
It also verifies production build artifacts and boots the built backend for a local production smoke check.

## Seed Demo Data

```powershell
npm.cmd --workspace backend run seed
```

This creates demo leaderboard users only. It does not add secrets or external API dependencies.

## Operations Docs

- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- [docs/OPERATIONS.md](docs/OPERATIONS.md)
- [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md)
- [docs/PRODUCTION_HANDOFF.md](docs/PRODUCTION_HANDOFF.md)
- [docs/RELEASE_NOTES.md](docs/RELEASE_NOTES.md)
- [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md)

## Deployment Templates

- [render.yaml](render.yaml)
- [frontend/vercel.json](frontend/vercel.json)
- [backend/Dockerfile](backend/Dockerfile)
- [frontend/Dockerfile](frontend/Dockerfile)

## Milestone 1 Included

- Correct `frontend/` and `backend/` monorepo structure
- React + Vite + TypeScript frontend
- Tailwind CSS
- React Router
- Framer Motion page transitions
- Reusable UI components
- All required frontend pages
- Game registry architecture
- Metadata for all 35 games
- Placeholder screens for non-MVP games
- Playable local MVP demos for:
  - Guess the Movie
  - Dumb Charades
  - Heads Up
  - Rapid Fire
  - Emoji Challenge

## Milestone 2 Includes

- Express backend app and server
- MongoDB/Mongoose connection
- User model
- Signup, login, and guest login routes
- JWT signing and auth middleware
- Password hashing for account signup/login
- Protected frontend route shell
- Frontend auth service and auth context
- Profile/stat screens connected to the signed-in user

## Milestone 3 Includes

- Room model and room API
- Create room and join room using backend data
- Host/guest player membership
- Room codes
- Lobby persistence
- Basic room ownership and protected room actions

## Milestone 4 Includes

- Socket.IO backend setup
- Client socket service
- Authenticated socket connections
- Realtime lobby update broadcasts
- Lobby UI realtime status
- Host-only lobby action broadcasting foundation

## Milestone 5 Includes

- Team assignment sync
- Persisted team setup
- Team randomization endpoint
- Host-only team lock
- Realtime team update broadcasts
- Team setup UI connected to active room data
- Locking teams advances the room to game selection

## Milestone 6 Next

- Game selection tied to the active room
- Persist selected game on room
- Persist selected category on room
- Host-only game/category selection
- Realtime game/category broadcasts
- Game intro reads from room selection

## Milestone 7 Next

- Room-backed gameplay session model
- Start selected game from Game Intro
- Current round state
- Active team turn state
- Correct/skip submitted through backend
- Realtime gameplay updates

## Milestone 8 Next

- Round timer state
- Time-up transition
- Round result screen from backend state
- End round endpoint
- Next round endpoint
- Scoreboard/leaderboard from room gameplay state

## Milestone 9 Next

- Finish game endpoint
- Final winner from backend scores
- Persist player stats after final result
- Persist achievements/coins updates
- Final Winner page from room data
- Room close/reset controls

## Milestone 10 Next

- Persistent global leaderboard endpoint
- Profile refresh after game completion
- Achievements page from backend data
- Statistics page from backend stats endpoint
- Store purchase placeholders tied to coins
- Room history/recent games

## Milestone 11 Next

- UX polish pass across gameplay flows
- Better empty/loading/error states
- Mobile layout QA
- Room recovery after refresh
- Host/guest instruction text
- Manual end-to-end playtest checklist

## Milestone 12 Next

- Automated backend tests
- Automated frontend smoke tests
- Playwright browser flow checks
- Accessibility pass
- Performance cleanup
- Deployment preparation

## Milestone 13 Next

- Optional Playwright browser automation with installed browsers
- Production deployment to selected host
- Environment-specific CORS/socket validation
- Error monitoring/logging plan
- Seed data tooling
- Final content and visual polish

## Milestone 14 Next

- Pick deployment target
- Configure real production environment variables
- Deploy backend and frontend
- Validate Socket.IO in production
- Run manual playtest against deployed URLs
- Add platform-specific monitoring/logging

## Milestone 15 Next

- Actual deployment to the selected provider
- MongoDB Atlas production database setup
- Production environment variable entry
- Deployed URL smoke tests
- Shareable public demo link

## Milestone 16 Next

- Live deployment using your selected accounts
- Enter production env vars in provider dashboards
- Validate `/api/health` and `/api/config-check`
- Run deployed host/guest playtest
- Seed optional demo leaderboard data
- Publish demo URL

## Milestone 17 Next

- Connect to actual deployment providers
- Configure MongoDB Atlas
- Deploy backend
- Deploy frontend
- Validate deployed realtime gameplay
- Share live URL
