# Roadmap

Each weekend has a goal, the tasks **you** write, and what you learn. Tick tasks off as you go.

## Phase 1 — MVP (weekends)

### Weekend 1 — Foundation ✅ (scaffolded) + your first endpoint

Already done: monorepo, Express + TypeScript server, MongoDB connection, Stop/Route/Trip models, seed script, routes API, Next.js page listing routes.

Your tasks:
- [ ] Read every file in `apps/server/src` top to bottom. Follow one request: `index.ts → app.ts → routes → model → MongoDB`.
- [ ] Open the DB in MongoDB Compass (`mongodb://127.0.0.1:27017/rixawala`) and look at the `stops` and `routes` collections.
- [ ] **Build `GET /api/stops/nearby?lat=17.44&lng=78.49&radius=1000`** that returns stops within `radius` metres, closest first.
  - Create `src/routes/stop.routes.ts` and mount it in `app.ts`.
  - Validate the query with Zod (`z.coerce.number()`), so `?lat=abc` returns 400.
  - Use Mongo's `$near` with `$geometry` and `$maxDistance`. Remember coordinates are `[lng, lat]`.
- [ ] Fix the seed data: check each stop's coordinates on Google Maps and update `seed.ts`.

Learn: Express request flow, Mongoose models, references + `populate`, geospatial indexes, validation.

### Weekend 2 — Trips and the state machine
- [ ] `POST /api/trips` (driver starts loading at a stand), `GET /api/trips?route=SEC-AMP&status=LOADING`
- [ ] `PATCH /api/trips/:id/seats` (+1 / -1, never below 0 or above capacity)
- [ ] `POST /api/trips/:id/depart`, `/advance` (next stop), `/complete`, `/cancel`
- [ ] Put the rules in `src/services/trip.service.ts`, not in route handlers. Reject illegal moves (e.g. completing a LOADING trip) with 409.
- [ ] Make seat updates atomic with `findOneAndUpdate` + `$inc` and a condition, so two taps at once can't overfill.

Learn: service layer, state machines, race conditions, atomic updates.

### Weekend 3 — Driver screen
- [ ] `/driver` page: pick route, enter name + vehicle number, start trip
- [ ] Huge buttons: `+1 seat`, `-1`, `Depart`, `Next stop`, `Complete`
- [ ] Works one-handed on a phone; test in Chrome DevTools mobile view

Learn: Client Components, forms, optimistic UI.

### Weekend 4 — Real-time with Socket.IO
- [ ] Attach Socket.IO to the HTTP server in `index.ts`
- [ ] Rooms per route (`route:SEC-AMP`); emit `trip:updated` whenever a trip changes
- [ ] Passenger page `/route/[code]` shows live loading autos, seats left, and moving autos

Learn: WebSockets, rooms, event design, reconnect handling.

### Weekend 5 — Passenger intent + map
- [ ] Passenger taps "I'm waiting at Paradise" → drivers on that route see waiting counts per stop
- [ ] Expire waiting intents after 15 minutes (MongoDB TTL index)
- [ ] Leaflet + OpenStreetMap map of the route with stops and autos

Learn: TTL indexes, maps, combining REST + sockets.

### Weekend 6 — Simulator
- [ ] `src/scripts/simulate.ts`: N fake autos that load, depart and move stop to stop; fake passengers appearing at stops
- [ ] Flags: `--autos 20 --speed 10x`
- [ ] Record a demo video for your resume / LinkedIn

Learn: writing load generators, timers, using your own API as a client.

### Weekend 7 — Auth
- [ ] Phone + OTP login (mock OTP `1234` in dev), JWT in httpOnly cookie
- [ ] Roles: `driver`, `passenger`; only the trip's driver can change it
- [ ] Rate-limit OTP requests

Learn: JWT, cookies, middleware, authorization vs authentication.

### Weekend 8 — Tests + deploy
- [ ] Vitest + Supertest for the trip service and API (use `mongodb-memory-server`)
- [ ] Deploy: MongoDB Atlas, API on Render/Railway, web on Vercel
- [ ] GitHub Actions: typecheck + test on every push

Learn: testing, CI, environment config, production deployment.

## Phase 2 — Scale and system design (later)

- Redis: live trip state, Socket.IO Redis adapter → run 2+ API instances
- Docker + docker-compose for the whole stack
- BullMQ job queue for "your auto leaves in 2 min" notifications
- k6 load tests using the simulator; find and fix the bottleneck
- Structured logging (pino), metrics, health checks
- Write an architecture doc: diagram, tradeoffs, "why Mongo, and where it hurt"
