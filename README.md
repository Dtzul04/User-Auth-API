# JWT Auth API 

Practice API for learning JWT authentication with Node.js, Express, and PostgreSQL.

## What this project is for

Build a simple auth flow:

1. Register a user (hash the password)
2. Log in and receive a JWT
3. Protect routes by verifying the JWT

## Stack

- **Express** — HTTP API
- **jsonwebtoken** — create and verify JWTs
- **bcrypt** — hash and compare passwords
- **pg** — PostgreSQL client
- **dotenv** — environment variables
- **TypeScript** — typed JavaScript

## Setup

```bash
npm install
```

Create a `.env` file in the project root (do not commit secrets):

```env
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/jwt_auth
JWT_SECRET=replace_with_a_long_random_string
```

## Run

```bash
npm start
```

> Note: if you keep using TypeScript (`.ts` files), you’ll need a runner like `tsx` or compile with `tsc` first. Plain `node file.ts` won’t work for real TypeScript code.

## Planned endpoints

| Method | Path        | Auth? | Purpose                          |
|--------|-------------|-------|----------------------------------|
| POST   | `/register` | No    | Create a user                    |
| POST   | `/login`    | No    | Return a JWT                     |
| GET    | `/me`       | Yes   | Example protected route          |