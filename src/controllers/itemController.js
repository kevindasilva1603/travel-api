import { Item, Trip } from "../models/index.js";

// Créer un item pour un voyage
export const createItem = async (req, res) => {
    const { tripId } = req.params;
    const { name, quantity } = req.body;

    if (!name || !quantity) {
        return res
            .status(400)
            .json({ message: "Name and quantity are required." });
    }

    try {
        const trip = await Trip.findByPk(tripId);

        if (!trip || trip.UserId !== req.user.id) {
            return res
                .status(404)
                .json({ message: "Trip not found or not authorized." });
        }

        const item = await Item.create({ name, quantity, TripId: tripId });

        res.status(201).json({ message: "Item created successfully!", item });
    } catch (error) {
        res.status(500).json({
            message: "Error creating item.",
            error: error.message,
        });
    }
};

// Lister les items d'un voyage
export const listItems = async (req, res) => {
    const { tripId } = req.params;

    try {
        const trip = await Trip.findByPk(tripId);

        if (!trip || trip.UserId !== req.user.id) {
            return res
                .status(404)
                .json({ message: "Trip not found or not authorized." });
        }

        const items = await Item.findAll({ where: { TripId: tripId } });
        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching items.",
            error: error.message,
        });
    }
};

// Mettre à jour un item
export const updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, quantity } = req.body;

    try {
        const item = await Item.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: "Item not found." });
        }

        const updatedItem = await item.update({ name, quantity });
        res.json({ message: "Item updated successfully!", updatedItem });
    } catch (error) {
        res.status(500).json({
            message: "Error updating item.",
            error: error.message,
        });
    }
};

// Supprimer un item
export const deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: "Item not found." });
        }

        await item.destroy();
        res.json({ message: "Item deleted successfully!" });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting item.",
            error: error.message,
        });
    }
};

// Marquer un item comme "pris"
export const markItemAsTaken = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: "Item not found." });
        }

        item.status = true;
        await item.save();
        res.json({ message: "Item marked as taken!", item });
    } catch (error) {
        res.status(500).json({
            message: "Error updating item status.",
            error: error.message,
        });
    }
};
