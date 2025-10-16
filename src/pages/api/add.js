import dbConnect from './_Connect';
import Candidature from './_Candidature';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  await dbConnect();
  try {
    const newCandidature = new Candidature(req.body);
    await newCandidature.save();
    res.status(201).json(newCandidature);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la candidature', error });
  }
}