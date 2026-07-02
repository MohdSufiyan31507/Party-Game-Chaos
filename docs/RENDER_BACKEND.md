# Render Backend Setup

Use this for deploying the Express + Socket.IO API.

## Option A: Blueprint

1. Push the repository to GitHub.
2. In Render, choose Blueprint.
3. Select the repository.
4. Render will read `render.yaml`.
5. Add environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
6. Deploy.

## Option B: Manual Web Service

1. Create a new Web Service.
2. Root directory:

```text
backend
```

3. Build command:

```text
npm install && npm run build
```

4. Start command:

```text
npm start
```

5. Health check:

```text
/api/health
```

## After Deploy

Open:

```text
https://<backend-domain>/api/health
https://<backend-domain>/api/config-check
```

Confirm:

- `ok` is `true`
- `jwtConfigured` is `true`
- `clientUrl` is your frontend domain
