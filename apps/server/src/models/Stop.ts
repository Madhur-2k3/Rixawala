import { Schema, model, type InferSchemaType } from "mongoose";

// A Stop is a physical place where shared autos pick up / drop passengers.
// Stops live in their own collection because one stop (e.g. Paradise)
// is shared by many routes.
const stopSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    // Is this a "stand" where autos wait and fill up, or just a stop on the way?
    isStand: { type: Boolean, default: false },
    // GeoJSON point. NOTE: MongoDB stores coordinates as [longitude, latitude].
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true }
);

// 2dsphere index enables geo queries like "stops within 1 km of me" ($near).
stopSchema.index({ location: "2dsphere" });

export type StopDoc = InferSchemaType<typeof stopSchema>;
export const Stop = model("Stop", stopSchema);
