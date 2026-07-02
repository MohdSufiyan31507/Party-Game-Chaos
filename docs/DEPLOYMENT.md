# Deployment Prep

This project includes deployment templates for a standard split deployment.

## Required Services

- MongoDB database
- Node.js backend host
- Static frontend host

Recommended default path:

- MongoDB Atlas for database
- Render-style Node web service for backend using `render.yaml`
- Vercel-style static deployment for frontend using `frontend/vercel.json`

## Backend Environment

Use `backend/.env.example` as the template.
For production placeholders, use `backend/.env.production.example`.

Required:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`

Do not commit real `.env` values.

## Frontend Environment

Use `frontend/.env.example` as the template.
For production placeholders, use `frontend/.env.production.example`.

Required:

- `VITE_API_URL`
- `VITE_SOCKET_URL`

## Build Commands

```powershell
npm.cmd run build:backend
npm.cmd run build
```

Or:

```powershell
npm.cmd run build:all
```

## Verification Commands

```powershell
npm.cmd run test:backend
npm.cmd run test:frontend
```

Full readiness gate:

```powershell
npm.cmd run ready
```

## Runtime Checks

After deployment:

- Open `/api/health`
- Open `/api/config-check`
- Confirm `jwtConfigured` is `true`
- Confirm `clientUrl` matches the frontend URL

## Backend Deploy Template

The root [render.yaml](../render.yaml) defines a backend web service:

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Health check: `/api/health`

Set these environment variables in the host dashboard:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `NODE_ENV=production`

## Frontend Deploy Template

The frontend [vercel.json](../frontend/vercel.json) configures Vite output and SPA rewrites.

Provider-specific guides:

- [MONGODB_ATLAS.md](MONGODB_ATLAS.md)
- [RENDER_BACKEND.md](RENDER_BACKEND.md)
- [VERCEL_FRONTEND.md](VERCEL_FRONTEND.md)

Set these environment variables in the frontend host:

- `VITE_API_URL=https://your-backend.example.com/api`
- `VITE_SOCKET_URL=https://your-backend.example.com`

## Docker Option

Dockerfiles are included for hosts that prefer containers:

- [backend/Dockerfile](../backend/Dockerfile)
- [frontend/Dockerfile](../frontend/Dockerfile)

The frontend container uses nginx with SPA fallback routing.

## Basic Release Checklist

1. Confirm there are no real secrets in the repository.
2. Confirm MongoDB accepts backend connections.
3. Confirm `CLIENT_URL` matches the deployed frontend origin.
4. Confirm `VITE_API_URL` points to `/api`.
5. Confirm `VITE_SOCKET_URL` points to the backend Socket.IO host.
6. Run backend tests.
7. Run frontend production build.
8. Run the manual host/guest checklist.
9. Confirm Socket.IO shows `Realtime: online` in lobby.
10. Confirm final winner updates player stats.
11. Confirm `/api/config-check` does not expose secret values.
12. Confirm frontend refresh works on nested routes like `/login`, `/home`, and `/lobby/:code`.

See [PRODUCTION_HANDOFF.md](PRODUCTION_HANDOFF.md) for the step-by-step deployment handoff.
