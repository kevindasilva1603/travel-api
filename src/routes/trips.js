import express from "express";
import { createTrip, listTrips } from "../controllers/tripController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route pour créer un voyage
router.post("/", authenticateToken, createTrip);

// Route pour lister les voyages
router.get("/", authenticateToken, listTrips);

export default router;
