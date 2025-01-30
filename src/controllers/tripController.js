import { Trip } from "../models/index.js";

// Créer un voyage
export const createTrip = async (req, res) => {
    const { destination, startDate, endDate } = req.body;

    if (!destination || !startDate || !endDate) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const trip = await Trip.create({
            destination,
            startDate,
            endDate,
            UserId: req.user.id, // Utilisateur connecté
        });

        res.status(201).json({ message: "Trip created successfully!", trip });
    } catch (error) {
        res.status(500).json({
            message: "Error creating trip.",
            error: error.message,
        });
    }
};

// Lister les voyages
export const listTrips = async (req, res) => {
    try {
        const trips = await Trip.findAll({
            where: { UserId: req.user.id },
        });

        res.json(trips);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching trips.",
            error: error.message,
        });
    }
};
