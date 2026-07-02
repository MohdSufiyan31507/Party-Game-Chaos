# Chaos Ka Adda Backend

Milestone 16 backend for Chaos Ka Adda.

## Includes

- Express app
- MongoDB connection through Mongoose
- User model
- Signup, login, guest login
- JWT auth middleware
- Profile/stat endpoints
- Room model
- Create room, join room, fetch room
- Host-only room status update
- Socket.IO server
- Authenticated socket connections
- Room update broadcasts
- Persisted room teams
- Host-only randomize teams
- Host-only lock teams
- Persist selected game
- Persist selected category
- Host-only game/category selection
- Room gameplay state
- Host-only start gameplay
- Host-only correct/skip scoring
- Host-only active team switch
- Round timer state
- End round result state
- Next round transition
- Final game result
- Player stat/coin/achievement updates
- Room reset
- Global leaderboard endpoint
- Recent rooms endpoint
- Store items and coin purchase endpoint
- Node built-in API smoke tests
- Seed demo data script
- Runtime config-check endpoint
- Render-style deployment template
- Backend Dockerfile
- CI readiness support
- Production handoff checks
- Local production smoke check support

## Not Yet Included

- Hosted environment validation

## Run

Create a private `backend/.env` from `backend/.env.example`, then run:

```powershell
cd "C:\Users\SAMSUNG\Desktop\Chaos Pressents"
npm.cmd run dev:backend
```
