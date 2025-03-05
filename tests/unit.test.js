import { generateToken } from "../src/controllers/authController.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

describe("Tests unitaires des fonctions utilitaires", () => {
    // 🚀 Test 1: Générer un token JWT valide
    it("Générer un token JWT valide", () => {
        const user = { id: 1, email: "test@example.com" };
        const token = generateToken(user);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        expect(decoded).toHaveProperty("id", 1);
        expect(decoded).toHaveProperty("email", "test@example.com");
    });

    // 🚀 Test 2: Vérifier l'expiration du token
    it("Le token JWT doit expirer après 24h", () => {
        const user = { id: 1, email: "test@example.com" };
        const token = generateToken(user);
        const decoded = jwt.decode(token);

        const expirationTime = decoded.exp - decoded.iat;
        expect(expirationTime).toEqual(86400); // 24h = 86400 secondes
    });
});
