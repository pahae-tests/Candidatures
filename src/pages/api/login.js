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
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { _id: user._id, nom: user.nom, prenom: user.prenom },
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
        res.status(200).json({ message: 'Connexion réussie !' });

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: 'Erreur lors de la connexion', error });
    }
}