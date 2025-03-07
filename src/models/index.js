// models/index.js
import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { z } from "zod";

const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const tripSchema = z
    .object({
        destination: z.string().min(1, "Destination is required"),
        startDate: z
            .string()
            .regex(/\d{4}-\d{2}-\d{2}/, "Invalid date format (YYYY-MM-DD)"),
        endDate: z
            .string()
            .regex(/\d{4}-\d{2}-\d{2}/, "Invalid date format (YYYY-MM-DD)"),
    })
    .refine((data) => data.startDate < data.endDate, {
        message: "startDate must be before endDate",
        path: ["startDate"],
    });

const itemSchema = z.object({
    name: z
        .string()
        .min(1, "Item name is required")
        .max(100, "Item name must not exceed 100 characters"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
});

const User = sequelize.define("User", {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
});

const Trip = sequelize.define("Trip", {
    destination: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
});

const Item = sequelize.define("Item", {
    name: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// Relations
User.hasMany(Trip, { foreignKey: "UserId" });
Trip.belongsTo(User, { foreignKey: "UserId" });
Trip.hasMany(Item, { foreignKey: "TripId" });
Item.belongsTo(Trip, { foreignKey: "TripId" });

export { sequelize, User, Trip, Item, registerSchema, tripSchema, itemSchema };
