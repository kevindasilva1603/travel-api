import express from "express";
import { register, login, getUserInfo } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route pour l'inscription
router.post("/register", register);

// Route pour la connexion
router.post("/login", login);

// Route pour récupérer les infos utilisateur (protégée par JWT)
router.get("/me", authenticateToken, getUserInfo);

export default router;
