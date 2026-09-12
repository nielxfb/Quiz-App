# Quiz App

A multiple-choice quiz application, split into a `backend` API and a `frontend` client.

## Structure

- `backend/` — NestJS + TypeORM REST API (quizzes, questions, choices, users, attempts). See [backend/README.md](backend/README.md).
- `frontend/` — React + Vite client. See [frontend/README.md](frontend/README.md).
- `docker-compose.dev.yml` — Postgres, backend, and frontend for local development, each with hot-reload via a bind mount.

## Getting started

**Everything in Docker (simplest):**

```bash
./start.sh   # docker compose -f docker-compose.dev.yml up -d
./stop.sh    # docker compose -f docker-compose.dev.yml down
```

Backend at `http://localhost:3000` (Swagger at `/docs`), frontend at `http://localhost:5173`. Copy `.env.example` to `.env` in both `backend/` and `frontend/` first — the containers read those files.

**Running natively instead** (no Docker for the apps themselves, just Postgres):

1. `docker compose -f docker-compose.dev.yml up -d db`
2. Run the backend — see [backend/README.md](backend/README.md).
3. Run the frontend — see [frontend/README.md](frontend/README.md).
