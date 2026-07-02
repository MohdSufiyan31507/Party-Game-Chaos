# Launch Checklist

Use this immediately before sharing a public demo link.

## Local

1. Run `npm.cmd run ready`.
2. Confirm no `.env` files are committed.
3. Confirm `docs/MANUAL_PLAYTEST.md` passes locally.
4. Confirm `docs/ACCESSIBILITY.md` manual checks are acceptable.

## Backend Host

1. Add `MONGO_URI`.
2. Add `JWT_SECRET`.
3. Add `CLIENT_URL`.
4. Add `NODE_ENV=production`.
5. Deploy backend.
6. Open `/api/health`.
7. Open `/api/config-check`.

## Frontend Host

1. Add `VITE_API_URL`.
2. Add `VITE_SOCKET_URL`.
3. Deploy frontend.
4. Open the deployed URL.
5. Signup or guest login.

## Public Demo

1. Create a room as host.
2. Join as guest from another browser.
3. Confirm `Realtime: online`.
4. Play one round.
5. Finish game.
6. Confirm winner text uses cooking/cooked correctly.
7. Confirm profile stats update.
