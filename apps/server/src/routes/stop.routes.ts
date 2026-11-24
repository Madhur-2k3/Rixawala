import { Router } from "express";
import { z } from "zod";
import { Stop } from "../models";

const router = Router();

// 1) Describe what a valid query string looks like.
//    Query params always arrive as strings ("17.44"), so z.coerce.number()
//    converts them to numbers and rejects junk like "abc".
const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive().max(10_000).default(1000), // metres
  limit: z.coerce.number().int().positive().max(50).default(10),
});

// GET /api/stops/nearby?lat=17.4433&lng=78.4875&radius=1500
router.get("/nearby", async (req, res) => {
  // 2) Validate. If invalid, .parse() throws a ZodError and our
  //    errorHandler turns it into a 400 response automatically.
  const { lat, lng, radius, limit } = nearbyQuerySchema.parse(req.query);

  // 3) Ask MongoDB for stops near the point.
  //    $near needs the 2dsphere index we declared in models/Stop.ts,
  //    and it returns results already sorted nearest-first.
  const stops = await Stop.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [lng, lat] }, // [lng, lat] order!
        $maxDistance: radius, // metres
      },
    },
  })
    .limit(limit)
    .lean(); // plain JS objects instead of full Mongoose documents (faster, read-only)

  res.json(stops);
});

// GET /api/stops -> every stop (handy for debugging)
router.get("/", async (_req, res) => {
  const stops = await Stop.find().sort({ name: 1 }).lean();
  res.json(stops);
});

export default router;
