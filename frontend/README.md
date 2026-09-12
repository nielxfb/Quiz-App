# Quiz App Frontend

React + TypeScript + Vite client for the [Quiz App backend](../backend).

## Setup

```bash
npm install
cp .env.example .env      # points at the backend API, defaults to http://localhost:3000
```

## Running

```bash
npm run dev       # dev server at http://localhost:5173
npm run build      # type-check + production build
npm run lint        # oxlint
```

Requires the backend running (see [../backend/README.md](../backend/README.md)) with `CORS_ORIGIN` allowing `http://localhost:5173` (the default).

## Pages

- `/login`, `/register` — cookie-session auth (see backend README's Authentication section)
- `/` — browse/take quizzes (students); admins are redirected to `/admin/quizzes` instead
- `/admin/quizzes`, `/admin/quizzes/:id`, `/admin/users` — admin-only dashboard (create/edit/delete quizzes, questions, choices; manage user accounts and roles)

## Stack

- [React Router](https://reactrouter.com) for routing, including three role-based guards (`components/protected-route.tsx`, `guest-route.tsx`, `admin-route.tsx`)
- [TanStack Query](https://tanstack.com/query) for server state (fetching/caching API data)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (`radix-nova` style) for styling/components — add new components with `npx shadcn@latest add <name>`
- `src/lib/api.ts` — small fetch wrapper reading `VITE_API_URL`, always sends `credentials: 'include'` for the cookie session
- Light/dark theme following the OS preference by default, with a manual override (`components/theme-provider.tsx`, `theme-toggle.tsx`)
