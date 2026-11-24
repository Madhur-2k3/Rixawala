// Seeds Route Zero: Secunderabad Station -> Ameerpet.
// Run with: npm run seed  (from the repo root)
//
// Coordinates are approximate and fares are PLACEHOLDERS.
// Replace them with real values once you've checked the route on the ground.
import { connectDB, disconnectDB } from "../db/connect";
import { Stop } from "../models/Stop";
import { Route } from "../models/Route";
import { Trip } from "../models/Trip";

const stops = [
  { name: "Secunderabad Station", isStand: true, lat: 17.4344, lng: 78.5013, fare: 0 },
  { name: "Paradise", isStand: false, lat: 17.4433, lng: 78.4875, fare: 10 },
  { name: "Rasoolpura", isStand: true, lat: 17.4446, lng: 78.4813, fare: 15 },
  { name: "Prakash Nagar", isStand: false, lat: 17.4449, lng: 78.4699, fare: 15 },
  { name: "Begumpet", isStand: false, lat: 17.4447, lng: 78.4627, fare: 20 },
  { name: "Ameerpet", isStand: true, lat: 17.4375, lng: 78.4482, fare: 25 },
];

async function seed() {
  await connectDB();

  console.log("Clearing old data...");
  await Promise.all([Trip.deleteMany({}), Route.deleteMany({}), Stop.deleteMany({})]);

  const created = await Stop.insertMany(
    stops.map((s) => ({
      name: s.name,
      isStand: s.isStand,
      location: { type: "Point", coordinates: [s.lng, s.lat] }, // [lng, lat]!
    }))
  );

  await Route.create({
    code: "SEC-AMP",
    name: "Secunderabad Station → Ameerpet",
    stops: created.map((stop, i) => ({ stop: stop._id, order: i, fareFromStart: stops[i].fare })),
  });

  console.log(`Seeded ${created.length} stops and 1 route (SEC-AMP).`);
  await disconnectDB();
}

seed().catch(async (err) => {
  console.error(err);
  await disconnectDB();
  process.exit(1);
});
