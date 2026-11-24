# Rixawala

Real-time coordination for shared autos on fixed routes in Hyderabad. Passengers see which autos are filling up at a stand and when they leave; drivers see how many people are waiting at stops ahead.

A weekend learning project: MERN + TypeScript first, system design later. See [docs/ROADMAP.md](docs/ROADMAP.md).

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS 4 |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB + Mongoose |
| Real-time (planned) | Socket.IO |
| Validation | Zod |

## Project structure

```
rixawala/
├── apps/
│   ├── server/                 Express API
│   │   └── src/
│   │       ├── config/env.ts   validated environment variables
│   │       ├── db/connect.ts   MongoDB connection
│   │       ├── models/         Stop, Route, Trip (Mongoose)
│   │       ├── routes/         HTTP endpoints
│   │       ├── middleware/     error handling
│   │       ├── scripts/seed.ts seeds Route Zero
│   │       ├── app.ts          builds the Express app
│   │       └── index.ts        starts the HTTP server
│   └── web/                    Next.js app (passenger + driver UI)
│       └── src/
│           ├── app/            pages
│           └── lib/api.ts      typed API client
└── docs/ROADMAP.md
```

## Run it locally

Prerequisites: Node 20+, MongoDB running on `127.0.0.1:27017` (local install or `docker run -d -p 27017:27017 mongo:8`).

```bash
npm install                      # installs both apps (npm workspaces)
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env.local
npm run seed                     # loads the Secunderabad → Ameerpet route
npm run dev                      # API on :4000, web on :3000
```

## API

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/api/health` | Server and DB status |
| GET | `/api/routes` | All active routes with stops |
| GET | `/api/routes/:code` | One route, e.g. `SEC-AMP` |
