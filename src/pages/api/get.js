import dbConnect from './_Connect';
import Candidature from './_Candidature';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { user } = req.query;

    await dbConnect();
    try {
        const candidatures = await Candidature.find({ user });
        res.status(200).json(candidatures);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des candidatures', error });
    }
}