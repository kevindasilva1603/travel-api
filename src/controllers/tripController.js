import { Trip } from "../models/index.js";

// Créer un voyage avec validation des erreurs
export const createTrip = async (req, res) => {
    const { destination, startDate, endDate } = req.body;

    if (!destination) {
        return res.status(400).json({ message: "Destination is required" });
    }
    if (!startDate) {
        return res.status(400).json({ message: "Start date is required" });
    }
    if (!endDate) {
        return res.status(400).json({ message: "End date is required" });
    }
    if (new Date(startDate) >= new Date(endDate)) {
        return res
            .status(400)
            .json({ message: "Start date must be before end date" });
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

// Récupérer un voyage par ID avec validation 404
export const getTripById = async (req, res) => {
    const { id } = req.params;

    try {
        const trip = await Trip.findOne({
            where: { id, UserId: req.user.id },
        });

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        res.json(trip);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching trip.",
            error: error.message,
        });
    }
};
