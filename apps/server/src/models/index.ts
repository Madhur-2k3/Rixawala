// Import every model here, and import this file once at startup (app.ts).
// Mongoose only knows a model after its file has run, and .populate("stops.stop")
// looks up the "Stop" model by name — so it must be registered even if no
// route handler imports Stop directly.
export { Stop } from "./Stop";
export { Route } from "./Route";
export { Trip, TRIP_STATUSES, type TripStatus } from "./Trip";
