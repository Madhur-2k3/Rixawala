import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

// Used by you (and later by Docker / load balancers) to check the server is alive.
router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptimeSeconds: Math.round(process.uptime()),
  });
});

export default router;
