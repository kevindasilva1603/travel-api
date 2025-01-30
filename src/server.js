import "dotenv/config";
import express from "express";
import { sequelize } from "./models/index.js";
import authRoutes from "./routes/auth.js";
import tripRoutes from "./routes/trips.js";
import itemRoutes from "./routes/items.js";
import cors from "cors";

const app = express(); // Initialisez app ici
app.use(express.json());
app.use(cors());
app.use("/items", itemRoutes);

app.use("/trips", tripRoutes);

// Ajoutez les routes après l'initialisation de app
app.use("/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Travel Packing List API is running!");
});

// Sync database and start server
const PORT = process.env.PORT || 3000;

(async () => {
    try {
        console.log("Before sequelize.sync");
        await sequelize.sync({ force: true }); // Force recrée les tables à chaque démarrage
        console.log("After sequelize.sync");

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
})();
