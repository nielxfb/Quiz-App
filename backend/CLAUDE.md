# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start:dev          # dev server, watch mode
npm run build               # nest build (applies @nestjs/swagger CLI plugin, see below)
npm run lint                 # oxlint src/ test/
npm test                     # unit tests (vitest run)
npm run test:watch           # unit tests, watch mode
npm run test:e2e             # e2e tests against a dedicated test DB (see below)
npm run test:cov             # unit test coverage
```

Single test file: `npx vitest run path/to/file.spec.ts` (unit) or `npx vitest run --config ./vitest.config.e2e.ts path/to/file.e2e-spec.ts` (e2e).

### Database

Postgres is required (`docker compose -f ../docker-compose.dev.yml up -d` from repo root). `.env` (copy from `.env.example`) configures the dev DB; `synchronize: true` is on outside production, so tables are created/altered automatically on boot — no migrations exist.

e2e tests use a **separate** database, never the dev one. `.env.test` (copy from `.env.test.example`) must point `DB_NAME` at a name ending in `_test`; `test/setup/global-setup.ts` enforces this and drops+recreates the `public` schema before the suite runs, so tests always start from empty. `vitest.config.e2e.ts` runs spec files sequentially (`fileParallelism: false`) because they share this one database and would otherwise race on schema creation.

## Architecture

NestJS + TypeORM, ESM (`"type": "module"`, all relative imports use explicit `.js` extensions per NodeNext resolution).

### Feature module layout

Every domain feature (`quizzes`, `questions`, `choices`, `users`, `attempts`) under `src/` follows the same four-layer shape:

- `entities/*.entity.ts` — TypeORM entity
- `dto/create-*.dto.ts`, `dto/update-*.dto.ts` — `class-validator`-annotated request DTOs (`update-*` is `PartialType(Create*Dto)` from `@nestjs/mapped-types`)
- `*.repository.ts` — CRUD-only TypeORM access, no business logic
- `*.service.ts` — business logic, calls its own repository (and other features' *services*, never their repositories directly)
- `*.controller.ts` — thin HTTP layer
- `*.module.ts` — wires `TypeOrmModule.forFeature([...])` → repository → service → controller, `exports` the service for other modules

### Cross-feature dependencies and routing

Relations form a chain: `Quiz → Question → Choice`, and `User`/`Quiz → Attempt → AttemptAnswer` (which references both a `Question` and the `Choice` picked). This drives two things:

1. **Nested-resource controllers.** `QuestionsController`, `ChoicesController`, and `AttemptsController` each expose both a nested-create/list route and a flat by-id route (e.g. `POST /quizzes/:quizId/questions` and `GET /questions/:id` live in the same `QuestionsController`). They use `@Controller()` with the full path spelled out per-route rather than a fixed prefix, precisely because they need two different route roots.
2. **A genuine circular module dependency**: `UsersModule` needs `AttemptsService` (for `GET /users/:id/attempts` and `GET /users/:id/quizzes`), and `AttemptsService` needs `UsersService` (to validate `userId` when starting an attempt). Both sides use `forwardRef()` — if you add a new cross-feature call in either direction, check whether it reintroduces this cycle.

### Entity relations and ESM (`Relation<T>`)

Entity relation properties (e.g. `Question.quiz`, `Choice.question`) are typed as `Relation<Question>` etc., with `Relation` imported via `import type { Relation } from 'typeorm'`. This is required, not stylistic: under ESM with `emitDecoratorMetadata` + `isolatedModules`, a direct circular type reference (`Question` importing `Choice` and vice versa) crashes at runtime with a `ReferenceError` (TDZ), and `Relation` must be a type-only import specifically because it's used only in type position — mixing it into the regular value import from `typeorm` breaks the isolatedModules check. When adding a new relation property, follow this exact pattern.

### Auth/security notes

- `User.password` has `@Column({ select: false })` (excluded from query results) **and** `@Exclude()` from `class-transformer` (excluded from serialized responses via the global `ClassSerializerInterceptor` in `main.ts`) — `select: false` alone does not stop a freshly-`save()`d entity from having the plaintext/hashed password in the object returned to the controller, so both are needed.
- Passwords are hashed with `bcrypt` in `UsersService`, never in the controller or repository.

### Swagger

`nest-cli.json` enables the `@nestjs/swagger` CLI plugin, which auto-generates `@ApiProperty` schemas from DTO/entity TypeScript types at build time (via `nest build`, not via raw `tsc` or vitest) — no need to hand-annotate DTO fields. UI is served at `/docs`, spec at `/docs-json`, set up in `main.ts`.
