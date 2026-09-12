# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

Requires the backend running at `VITE_API_URL` (`.env`, copy from `.env.example`) with `CORS_ORIGIN` allowing this origin — see `../backend/CLAUDE.md`. Don't run both the native `npm run dev` and the `frontend` Docker container at once (port 5173 conflict) — same caveat as the backend.

No test suite exists yet in this package.

## Architecture

Vite + React 19 + TypeScript, Tailwind v4 + shadcn/ui (`components.json`, style `radix-nova`), React Router, TanStack Query for all server state.

### `src/lib/api.ts` — the fetch wrapper

Every API call goes through `api<T>(path, init)`, which always sets `credentials: 'include'` (required for the cookie session to be sent cross-origin to `:3000`) and parses the response by reading it as text first, then `JSON.parse`-ing only if non-empty — **not** by branching on status code. This was a real bug: `DELETE /quizzes/:id` returns `204`, but `DELETE /users/:id`, `/questions/:id`, `/choices/:id` return `200` with an empty body, and code that only special-cased `204` threw trying to parse an empty `200` response. If you add a new mutation with an empty-body response, this wrapper already handles it — don't add another status-code special case.

### Route guards

Three wrapper components gate `<Outlet/>` based on `useCurrentUser()` (`hooks/use-auth.ts`, backed by `GET /auth/me`):

- `ProtectedRoute` — redirects to `/login` if logged out.
- `GuestRoute` — redirects logged-in users away from `/login`/`/register` to `/`.
- `AdminRoute` — redirects to `/login` if logged out, to `/` if logged in but not `role: 'admin'`.

`QuizList` (the `/` route) itself redirects admins to `/admin/quizzes` — landing on the student browse view isn't useful for an admin account, and this covers it regardless of *how* they arrived at `/` (login, clicking the logo, browser back), rather than special-casing every place that navigates there.

### TanStack Query key conventions

- `['auth', 'me']` — current session. `useLogin`/`useRegister` call `queryClient.setQueryData` directly with the response instead of invalidating, since the login/register response body *is* the user.
- `['quizzes']`, `['quiz', id]`, `['quiz', quizId, 'questions']` — used by **both** the student `QuizList` and the admin quiz hooks (`hooks/use-admin-quizzes.ts`). This is deliberate cache sharing, not an accident — don't give the admin hooks separate keys for the same data.
- `['admin', 'users']` — admin-only, `hooks/use-admin-users.ts`.

### Admin quiz editor (`pages/admin/AdminQuizDetail.tsx`)

Question/choice text uses `InlineEditText` (`components/inline-edit-text.tsx`) — click a pencil icon to edit, Enter/✓ saves via the corresponding `PATCH`, Esc/✗ cancels without a network call. Choice correctness is a live-toggling checkbox (`PATCH` on every change, not a separate save step). When adding another editable field anywhere in the admin UI, follow this pattern rather than a modal or a full-page edit form.

### Theme (light/dark/system)

`ThemeProvider` (`components/theme-provider.tsx`) exposes both `theme` (the stored preference: `'light' | 'dark' | 'system'`) and `resolvedTheme` (always `'light' | 'dark'`, resolving `'system'` via `matchMedia`) — components that need to *display* current state (like the toggle button's icon) should read `resolvedTheme`, not `theme`. A blocking inline `<script>` in `index.html` applies the `.dark` class before React mounts, to avoid a flash of the wrong theme; if you change how the theme is derived or stored, update both places.

### shadcn components

Add new ones with `npx shadcn@latest add <name>` from `frontend/` — it already knows this project's config (`components.json`: `radix-nova` style, `@/` alias, CSS variables in `src/index.css`). Don't hand-write files under `components/ui/`; regenerate or extend them via the CLI so they stay consistent with the rest.
