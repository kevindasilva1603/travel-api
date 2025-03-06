import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { Sequelize } from "sequelize";

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
};

// Inscription d'un utilisateur
export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });

        res.status(201).json({
            message: "User registered successfully!",
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            return res
                .status(409)
                .json({ message: "Email is already in use." });
        }
        res.status(500).json({
            message: "Error registering user.",
            error: error.message,
        });
    }
};

// Connexion d'un utilisateur
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        );
        res.json({ message: "Login successful!", token });
    } catch (error) {
        res.status(500).json({
            message: "Error logging in.",
            error: error.message,
        });
    }
};

// Récupérer les infos utilisateur
export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ["id", "email"],
        });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user info.",
            error: error.message,
        });
    }
};
