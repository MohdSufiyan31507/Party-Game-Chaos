# MongoDB Atlas Setup

1. Create a MongoDB Atlas account.
2. Create a free or shared cluster.
3. Create a database user with a strong password.
4. Add network access for your backend host.
5. Copy the connection string.
6. Replace `<username>`, `<password>`, and cluster host values.
7. Use the final URI as backend `MONGO_URI`.

Recommended database name:

```text
chaos-ka-adda
```

The URI should look like:

```text
mongodb+srv://USER:PASSWORD@CLUSTER/chaos-ka-adda?retryWrites=true&w=majority
```

Do not commit this URI.
