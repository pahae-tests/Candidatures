import dbConnect from './_Connect';
import Candidature from './_Candidature';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.query;
  await dbConnect();
  try {
    const updatedCandidature = await Candidature.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCandidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    res.status(200).json(updatedCandidature);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la candidature', error });
  }
}