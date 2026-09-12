# Quiz App

A multiple-choice quiz application, split into a `backend` API and a `frontend` client.

## Structure

- `backend/` — NestJS + TypeORM REST API (quizzes, questions, choices, users, attempts). See [backend/README.md](backend/README.md).
- `frontend/` — React + Vite client. See [frontend/README.md](frontend/README.md).
- `docker-compose.dev.yml` — local Postgres for development (`docker compose -f docker-compose.dev.yml up -d`).

## Getting started

1. Start Postgres:
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```
2. Run the backend — see [backend/README.md](backend/README.md).
3. Run the frontend — see [frontend/README.md](frontend/README.md).
