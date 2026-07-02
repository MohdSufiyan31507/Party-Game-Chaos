# Operations Notes

## Health Checks

- `GET /api/health` confirms the API is alive.
- `GET /api/config-check` confirms public runtime config shape without exposing secrets.

The config check returns whether `JWT_SECRET` and `MONGO_URI` are configured, but it does not return their values.

## Logs

The backend currently uses `morgan("dev")` request logs and startup config summary logs.

For production, connect platform logs to the host provider first. Later improvements can add structured JSON logs, request IDs, and error tracking.

## Seed Data

For local demos:

```powershell
cd "C:\Users\SAMSUNG\Desktop\Chaos Pressents"
$env:JWT_SECRET="your-local-long-secret"
npm.cmd --workspace backend run seed
```

Seed creates a few leaderboard users and removes previous seed users with the same names.

## Production CORS And Socket Checks

1. Set backend `CLIENT_URL` to the exact frontend origin.
2. Set frontend `VITE_API_URL` to the backend `/api` base URL.
3. Set frontend `VITE_SOCKET_URL` to the backend origin, not `/api`.
4. Open the frontend and login.
5. Create a room and confirm lobby says `Realtime: online`.
6. Join from another browser and confirm player list updates without refresh.

## Deployment Templates

- `render.yaml` is a Render-style backend service template.
- `frontend/vercel.json` is a Vercel-style Vite SPA template.
- `backend/Dockerfile` can run the API as a container.
- `frontend/Dockerfile` can serve the built frontend through nginx.

These templates do not contain secrets. Configure secrets only in the deployment provider dashboard.
