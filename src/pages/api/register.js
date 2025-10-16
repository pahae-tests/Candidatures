import dbConnect from './_Connect';
import User from './_User';
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import bcrypt from 'bcryptjs';

const JWT_SECRET = "1111";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    await dbConnect();
    const { nom, prenom, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
        nom,
        prenom,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();

        const token = jwt.sign(
            { _id: newUser._id, nom: newUser.nom, prenom: newUser.prenom },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        const serialized = serialize("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        res.setHeader("Set-Cookie", serialized);
        res.status(201).json({ message: 'Inscription réussie !' });

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription', error });
    }
}