import { generateToken } from "../src/controllers/authController.js";
import jwt from "jsonwebtoken";
import { tripSchema, itemSchema } from "../src/models/index.js";
import "dotenv/config";

describe("Tests unitaires des fonctions utilitaires", () => {
    // TESTS JWT
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
        const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
        expect(() => {
            jwt.verify(expiredToken, process.env.JWT_SECRET);
        }).toThrow();
    });

    it("Le token JWT doit contenir un algorithme de signature", () => {
        const user = { id: 1, email: "test@example.com" };
        const token = generateToken(user);
        const decodedHeader = JSON.parse(
            Buffer.from(token.split(".")[0], "base64").toString()
        );

        expect(decodedHeader).toHaveProperty("alg", "HS256");
    });

    it("Un token modifié doit être rejeté", () => {
        const user = { id: 1, email: "test@example.com" };
        let token = generateToken(user);
        token = token.replace(/.$/, "A"); // Modifie un caractère du token

        expect(() => {
            jwt.verify(token, process.env.JWT_SECRET);
        }).toThrow();
    });

    //  TESTS VALIDATION TRIP
    it("Valider un trip correct", () => {
        const result = tripSchema.safeParse({
            destination: "Paris",
            startDate: "2024-06-01",
            endDate: "2024-06-10",
        });
        expect(result.success).toBe(true);
    });

    it("Refuser un trip où startDate est après endDate", () => {
        const result = tripSchema.safeParse({
            destination: "Paris",
            startDate: "2024-06-10",
            endDate: "2024-06-01",
        });
        expect(result.success).toBe(false);
    });

    it("Refuser un trip sans destination", () => {
        const result = tripSchema.safeParse({
            startDate: "2024-06-01",
            endDate: "2024-06-10",
        });
        expect(result.success).toBe(false);
    });

    it("Refuser un trip sans startDate", () => {
        const result = tripSchema.safeParse({
            destination: "New York",
            endDate: "2024-06-10",
        });
        expect(result.success).toBe(false);
    });

    it("Refuser un trip sans endDate", () => {
        const result = tripSchema.safeParse({
            destination: "New York",
            startDate: "2024-06-01",
        });
        expect(result.success).toBe(false);
    });

    it("Refuser un trip avec startDate == endDate", () => {
        const result = tripSchema.safeParse({
            destination: "Tokyo",
            startDate: "2024-06-01",
            endDate: "2024-06-01",
        });
        expect(result.success).toBe(false);
    });

    //  TESTS VALIDATION ITEM
    it("Valider un item correct", () => {
        const result = itemSchema.safeParse({ name: "Valise", quantity: 2 });
        expect(result.success).toBe(true);
    });

    it("Refuser un item avec quantité négative", () => {
        const result = itemSchema.safeParse({
            name: "Chaussures",
            quantity: -5,
        });
        expect(result.success).toBe(false);
    });

    it("Refuser un item avec quantité = 0", () => {
        const result = itemSchema.safeParse({ name: "Sac", quantity: 0 });
        expect(result.success).toBe(false);
    });

    it("Refuser un item sans nom", () => {
        const result = itemSchema.safeParse({ quantity: 2 });
        expect(result.success).toBe(false);
    });

    it("Refuser un item sans quantité", () => {
        const result = itemSchema.safeParse({ name: "Sac" });
        expect(result.success).toBe(false);
    });

    it("Refuser un item avec un nom vide", () => {
        const result = itemSchema.safeParse({ name: "", quantity: 2 });
        expect(result.success).toBe(false);
    });

    it("Refuser un item avec un nom trop long", () => {
        const result = itemSchema.safeParse({
            name: "A".repeat(101),
            quantity: 2,
        });
        expect(result.success).toBe(false);
    });
});
