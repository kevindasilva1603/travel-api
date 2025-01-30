import express from "express";
import {
    createItem,
    listItems,
    updateItem,
    deleteItem,
    markItemAsTaken,
} from "../controllers/itemController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route pour créer un item
router.post("/:tripId", authenticateToken, createItem);

// Route pour lister les items d'un voyage
router.get("/:tripId", authenticateToken, listItems);

// Route pour mettre à jour un item
router.put("/:id", authenticateToken, updateItem);

// Route pour supprimer un item
router.delete("/:id", authenticateToken, deleteItem);

// Route pour marquer un item comme "pris"
router.patch("/:id/taken", authenticateToken, markItemAsTaken);

export default router;
