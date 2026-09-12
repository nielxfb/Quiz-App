# Quiz App Backend

NestJS + TypeORM REST API for a multiple-choice quiz app: quizzes, questions, choices, users, and attempts (with scoring).

## Setup

```bash
npm install
cp .env.example .env      # adjust DB_* if needed
```

Requires a running Postgres matching `.env` (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`). From the repo root: `docker compose -f ../docker-compose.dev.yml up -d`. The database schema is created automatically on boot (`synchronize: true` outside production).

## Running

```bash
npm run start:dev    # watch mode
npm run start         # no watch
npm run start:prod    # runs dist/main.js, requires `npm run build` first
```

Once running:
- API at `http://localhost:3000` (e.g. `POST /quizzes`, `GET /quizzes/:id/questions`, ...)
- Swagger UI at `http://localhost:3000/docs` (raw spec at `/docs-json`)

## Authentication

Every endpoint requires a logged-in session, except `POST /users` (register), `POST /auth/login`, and `GET /` (health check). Login sets an `httpOnly` session cookie — there's no `Authorization`-header/bearer-token flow.

```
POST /users        { username, email, password }   -> creates an account
POST /auth/login    { email, password }              -> sets the session cookie
GET  /auth/me                                          -> current user
POST /auth/logout                                     -> clears the session
```

A browser-based client must send `credentials: 'include'` on every request for the cookie to be sent/accepted cross-origin (see `CORS_ORIGIN` in `.env.example`).

## Testing

```bash
npm test              # unit tests (vitest)
npm run test:e2e      # e2e tests (vitest + supertest)
npm run test:cov       # coverage
```

E2e tests run against a dedicated `quiz_app_test` database, not your dev database — copy `.env.test.example` to `.env.test` first and point `DB_NAME` at a database whose name ends in `_test` (the global setup hook refuses to run against anything else, since it wipes the target schema before each run).

## Project structure

Each domain feature (`quizzes`, `questions`, `choices`, `users`, `attempts`) follows the same layout under `src/`:

- `entities/*.entity.ts` — TypeORM entity
- `dto/*.dto.ts` — request validation (`class-validator`)
- `*.repository.ts` — data access only (wraps TypeORM's `Repository<T>`)
- `*.service.ts` — business logic
- `*.controller.ts` — thin HTTP layer
- `*.module.ts` — wiring

Linting: `npm run lint` (oxlint).
