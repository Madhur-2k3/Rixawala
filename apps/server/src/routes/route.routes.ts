import { Router } from "express";
import { Route } from "../models";
import { HttpError } from "../middleware/errorHandler";

const router = Router();

// GET /api/routes -> all active routes with their stops filled in
router.get("/", async (_req, res) => {
  const routes = await Route.find({ isActive: true })
    .populate("stops.stop") // replace stop ObjectIds with the full Stop documents
    .sort({ code: 1 })
    .lean();
  res.json(routes);
});

// GET /api/routes/:code -> one route, e.g. /api/routes/SEC-AMP
router.get("/:code", async (req, res) => {
  const route = await Route.findOne({ code: req.params.code.toUpperCase() })
    .populate("stops.stop")
    .lean();
  if (!route) throw new HttpError(404, `Route ${req.params.code} not found`);
  res.json(route);
});

export default router;
