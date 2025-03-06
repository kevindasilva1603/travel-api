import request from "supertest";
import app from "../src/server.js";
import { sequelize } from "../src/models/index.js";
import "dotenv/config";

describe("Tests d'intégration de l'API Travel Packing List", () => {
    let token;
    let tripId;
    let itemId;
    let expiredToken =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJrZXZAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzgzMTI4NTEsImV4cCI6MTczODMwOTI1MX0.GHGluBx2QQKP02kyvNgc1wX6ghIMg-HfIdM0K3qpG1g"; // Token expiré fictif

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // ✅ Inscription d'un utilisateur
        await request(app)
            .post("/auth/register")
            .send({ email: "test@example.com", password: "password123" });

        // ✅ Connexion et récupération du token JWT
        const loginResponse = await request(app)
            .post("/auth/login")
            .send({ email: "test@example.com", password: "password123" });

        token = `Bearer ${loginResponse.body.token}`;
    });

    // 🚀 AUTHENTIFICATION
    it("Refuser une requête sans token (401)", async () => {
        const res = await request(app).get("/trips");
        expect(res.statusCode).toBe(401);
    });

    it("Refuser une requête avec un token invalide (403)", async () => {
        const res = await request(app)
            .get("/trips")
            .set("Authorization", "Bearer INVALID_TOKEN");
        expect(res.statusCode).toBe(403);
    });

    it("Refuser une requête avec un token expiré (403)", async () => {
        const res = await request(app)
            .get("/trips")
            .set("Authorization", expiredToken);
        expect(res.statusCode).toBe(403);
    });

    it("Refuser une connexion avec un email inexistant (404)", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: "notfound@example.com", password: "password123" });
        expect(res.statusCode).toBe(404);
    });

    it("Refuser une connexion avec un mauvais mot de passe (401)", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: "test@example.com", password: "wrongpassword" });
        expect(res.statusCode).toBe(401);
    });

    it("Refuser une inscription avec un email déjà utilisé (409)", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ email: "test@example.com", password: "password123" });
        expect(res.statusCode).toBe(409);
    });

    // 🚀 TRIPS
    it("Créer un voyage valide", async () => {
        const res = await request(app)
            .post("/trips")
            .set("Authorization", token)
            .send({
                destination: "New York",
                startDate: "2024-04-01",
                endDate: "2024-04-10",
            });

        expect(res.statusCode).toBe(201);
        tripId = res.body.trip.id;
    });

    it("Refuser un voyage sans destination (400)", async () => {
        const res = await request(app)
            .post("/trips")
            .set("Authorization", token)
            .send({ startDate: "2024-04-01", endDate: "2024-04-10" });

        expect(res.statusCode).toBe(400);
    });

    it("Refuser un voyage avec une date de début après la date de fin (400)", async () => {
        const res = await request(app)
            .post("/trips")
            .set("Authorization", token)
            .send({
                destination: "Tokyo",
                startDate: "2024-05-10",
                endDate: "2024-05-01",
            });

        expect(res.statusCode).toBe(400);
    });

    it("Essayer d'obtenir un voyage inexistant (404)", async () => {
        const res = await request(app)
            .get("/trips/999")
            .set("Authorization", token);

        expect(res.statusCode).toBe(404);
    });

    // 🚀 ITEMS
    it("Ajouter un item à un voyage", async () => {
        const res = await request(app)
            .post(`/items/${tripId}`)
            .set("Authorization", token)
            .send({ name: "Sac à dos", quantity: 1 });

        expect(res.statusCode).toBe(201);
        itemId = res.body.item.id;
    });

    it("Refuser un item avec une quantité négative (400)", async () => {
        const res = await request(app)
            .post(`/items/${tripId}`)
            .set("Authorization", token)
            .send({ name: "Chaussures", quantity: -5 });

        expect(res.statusCode).toBe(400);
    });

    it("Refuser un item sans nom (400)", async () => {
        const res = await request(app)
            .post(`/items/${tripId}`)
            .set("Authorization", token)
            .send({ quantity: 1 });

        expect(res.statusCode).toBe(400);
    });

    it("Récupérer un item spécifique", async () => {
        const res = await request(app)
            .get(`/items/${tripId}`)
            .set("Authorization", token);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it("Refuser la modification d'un item inexistant (404)", async () => {
        const res = await request(app)
            .put(`/items/999`)
            .set("Authorization", token)
            .send({ name: "Valise", quantity: 3 });

        expect(res.statusCode).toBe(404);
    });

    it("Marquer un item comme pris", async () => {
        const res = await request(app)
            .patch(`/items/${itemId}/taken`)
            .set("Authorization", token);

        expect(res.statusCode).toBe(200);
        expect(res.body.item.status).toBe(true);
    });

    it("Supprimer un item", async () => {
        const res = await request(app)
            .delete(`/items/${itemId}`)
            .set("Authorization", token);

        expect(res.statusCode).toBe(200);
    });

    it("Refuser la suppression d'un item inexistant (404)", async () => {
        const res = await request(app)
            .delete(`/items/999`)
            .set("Authorization", token);

        expect(res.statusCode).toBe(404);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});
