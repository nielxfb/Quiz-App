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

## Stack

- [React Router](https://reactrouter.com) for routing
- [TanStack Query](https://tanstack.com/query) for server state (fetching/caching API data)
- `src/lib/api.ts` — small fetch wrapper reading `VITE_API_URL`
