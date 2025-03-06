import { generateToken } from "../src/controllers/authController.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

describe("Tests unitaires des fonctions utilitaires", () => {
    it("Générer un token JWT valide", () => {
        const user = { id: 1, email: "test@example.com" };
        const token = generateToken(user);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        expect(decoded).toHaveProperty("id", 1);
        expect(decoded).toHaveProperty("email", "test@example.com");
    });

    it("Le token JWT doit expirer après 24h", () => {
        const user = { id: 1, email: "test@example.com" };
        const token = generateToken(user);
        const decoded = jwt.decode(token);

        const expirationTime = decoded.exp - decoded.iat;
        expect(expirationTime).toEqual(86400);
    });

    it("Refuser un token JWT invalide", () => {
        expect(() => {
            jwt.verify("INVALID_TOKEN", process.env.JWT_SECRET);
        }).toThrow();
    });

    it("Refuser un token JWT expiré", () => {
        const expiredToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJrZXZAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzgzMTI4NTEsImV4cCI6MTczODMwOTI1MX0.GHGluBx2QQKP02kyvNgc1wX6ghIMg-HfIdM0K3qpG1g";
        expect(() => {
            jwt.verify(expiredToken, process.env.JWT_SECRET);
        }).toThrow();
    });
});
