import express from "express";
import {
    createTrip,
    listTrips,
    getTripById,
} from "../controllers/tripController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route pour créer un voyage
router.post("/", authenticateToken, createTrip);

// Route pour lister les voyages
router.get("/", authenticateToken, listTrips);

// Route pour récupérer un voyage spécifique
router.get("/:id", authenticateToken, getTripById);

export default router;
