# ServerDesk

Internal ticketing tool

## Getting started

Install dependencies:

```bash
make install
```

Start the local Supabase instance and the dev server:

```bash
make start
```

The app runs at [http://localhost:5173](http://localhost:5173).
The Supabase studio runs at [http://localhost:54323](http://localhost:54323).

## Scripts

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Start the development server |
| `npm run build`     | Build for production         |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run format`    | Format code with Prettier    |
| `npm test`          | Run tests with Vitest        |

## Tech Stack

React, TypeScript, Vite, shadcn/ui, TanStack Query, React Router, Supabase, PostgreSQL.

## Database

Migrations live in `supabase/migrations/`. To reset and re-apply:

```bash
supabase db reset
```
