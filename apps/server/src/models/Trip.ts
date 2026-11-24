import { Schema, model, type InferSchemaType } from "mongoose";

// A Trip is one auto's single run along a route.
//
// Lifecycle (state machine):
//   LOADING   -> driver is at the stand, seats are filling
//   DEPARTED  -> auto left the stand
//   COMPLETED -> reached the last stop
//   CANCELLED -> driver abandoned the trip
//
// Weekend 2 task: write the service functions that move a trip between
// these states, and reject illegal moves (e.g. COMPLETED -> LOADING).
export const TRIP_STATUSES = ["LOADING", "DEPARTED", "COMPLETED", "CANCELLED"] as const;
export type TripStatus = (typeof TRIP_STATUSES)[number];

const tripSchema = new Schema(
  {
    route: { type: Schema.Types.ObjectId, ref: "Route", required: true, index: true },
    // No auth yet, so we store a plain driver name/vehicle number for now.
    driverName: { type: String, required: true, trim: true },
    vehicleNumber: { type: String, required: true, uppercase: true, trim: true },
    capacity: { type: Number, default: 6, min: 1, max: 10 },
    seatsFilled: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: TRIP_STATUSES, default: "LOADING", index: true },
    // Index into route.stops of the last stop the auto passed.
    currentStopIndex: { type: Number, default: 0, min: 0 },
    departedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

export type TripDoc = InferSchemaType<typeof tripSchema>;
export const Trip = model("Trip", tripSchema);
