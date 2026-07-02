# Production Handoff

Use this when you are ready to put Chaos Ka Adda online.

## Decisions Needed

1. Backend host URL.
2. Frontend host URL.
3. MongoDB Atlas connection string.
4. Long random `JWT_SECRET`.

Generate a JWT secret locally:

```powershell
npm.cmd run generate:jwt-secret
```

Use the printed value in the backend host dashboard. Do not save it in the repository.

## Recommended Values

Backend:

- `NODE_ENV=production`
- `MONGO_URI=<MongoDB Atlas URI>`
- `JWT_SECRET=<long random secret>`
- `CLIENT_URL=<frontend origin>`

Frontend:

- `VITE_API_URL=<backend origin>/api`
- `VITE_SOCKET_URL=<backend origin>`

## Preflight

Run locally before deploying:

```powershell
npm.cmd run ready
```

This checks env examples, scans for obvious committed secrets/forbidden AI API strings, runs backend smoke tests, and builds the frontend.

It also verifies production build artifacts and boots the built backend in-process for a smoke check.

## Deploy Order

1. Create MongoDB Atlas database using [MONGODB_ATLAS.md](MONGODB_ATLAS.md).
2. Deploy backend using [RENDER_BACKEND.md](RENDER_BACKEND.md).
3. Add backend environment variables.
4. Open backend `/api/health`.
5. Open backend `/api/config-check`.
6. Deploy frontend using [VERCEL_FRONTEND.md](VERCEL_FRONTEND.md).
7. Add frontend environment variables.
8. Run the manual host/guest checklist against deployed URLs.

## Post-Deploy Smoke Test

1. Signup or guest login.
2. Create room.
3. Join room from a second browser.
4. Confirm `Realtime: online`.
5. Lock teams.
6. Select game and category.
7. Start gameplay.
8. Score one card.
9. End round.
10. Finish game.
11. Confirm winner page and profile stats.

## Release Notes

See [RELEASE_NOTES.md](RELEASE_NOTES.md).

## Launch Checklist

See [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).
