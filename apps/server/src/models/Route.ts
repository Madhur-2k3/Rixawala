import { Schema, model, type InferSchemaType } from "mongoose";

// A Route is an ordered list of stops that shared autos run along.
// The first stop is normally the stand where autos wait to fill up.
const routeStopSchema = new Schema(
  {
    stop: { type: Schema.Types.ObjectId, ref: "Stop", required: true },
    order: { type: Number, required: true },
    // Per-seat fare (INR) from the first stop to this stop.
    fareFromStart: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const routeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    stops: {
      type: [routeStopSchema],
      validate: {
        validator: (stops: unknown[]) => stops.length >= 2,
        message: "A route needs at least 2 stops",
      },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type RouteDoc = InferSchemaType<typeof routeSchema>;
export const Route = model("Route", routeSchema);
