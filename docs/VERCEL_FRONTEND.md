# Vercel Frontend Setup

Use this for deploying the React/Vite frontend.

1. Push the repository to GitHub.
2. Create a new Vercel project.
3. Select the repository.
4. Set root directory:

```text
frontend
```

5. Vercel should use `frontend/vercel.json`.
6. Add environment variables:
   - `VITE_API_URL=https://<backend-domain>/api`
   - `VITE_SOCKET_URL=https://<backend-domain>`
7. Deploy.

## After Deploy

1. Open the frontend URL.
2. Signup or Guest Login.
3. Create a room.
4. Confirm the lobby shows:

```text
Realtime: online
```

If realtime is offline, check:

- Backend `CLIENT_URL`
- Frontend `VITE_SOCKET_URL`
- Backend host supports WebSockets
