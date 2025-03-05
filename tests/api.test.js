import request from "supertest";
import app from "../src/server.js";
import { sequelize } from "../src/models/index.js";
import "dotenv/config";

describe("Tests d'intégration de l'API Travel Packing List", () => {
    let token;
    let tripId;
    let itemId;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // Création d'un utilisateur test
        await request(app)
            .post("/auth/register")
            .send({ email: "test@example.com", password: "password123" });

        // Connexion et récupération du token JWT
        const loginResponse = await request(app)
            .post("/auth/login")
            .send({ email: "test@example.com", password: "password123" });

        token = loginResponse.body.token;
    });

    // 🚀 Test 1: Création d'un voyage
    it("Créer un voyage", async () => {
        const res = await request(app)
            .post("/trips")
            .set("Authorization", `Bearer ${token}`)
            .send({
                destination: "Paris",
                startDate: "2024-03-01",
                endDate: "2024-03-10",
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.trip).toHaveProperty("id");
        tripId = res.body.trip.id;
    });

    // 🚀 Test 2: Lister les voyages
    it("Récupérer la liste des voyages", async () => {
        const res = await request(app)
            .get("/trips")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // 🚀 Test 3: Récupérer un voyage spécifique
    it("Récupérer un voyage par ID", async () => {
        const res = await request(app)
            .get(`/trips/${tripId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toEqual(tripId);
    });

    // 🚀 Test 4: Ajouter un item à un voyage
    it("Ajouter un item à un voyage", async () => {
        const res = await request(app)
            .post(`/items/${tripId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Valise",
                quantity: 1,
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.item).toHaveProperty("id");
        itemId = res.body.item.id;
    });

    // 🚀 Test 5: Récupérer les items d'un voyage
    it("Lister les items d'un voyage", async () => {
        const res = await request(app)
            .get(`/items/${tripId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // 🚀 Test 6: Marquer un item comme pris
    it("Marquer un item comme pris", async () => {
        const res = await request(app)
            .patch(`/items/${itemId}/taken`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.item.status).toBe(true);
    });

    // 🚀 Test 7: Supprimer un item
    it("Supprimer un item", async () => {
        const res = await request(app)
            .delete(`/items/${itemId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
    });

    // 🚀 Test 8: Vérifier que l'item supprimé n'existe plus
    it("L'item supprimé ne doit plus être listé", async () => {
        const res = await request(app)
            .get(`/items/${tripId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(0);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});
