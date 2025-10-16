import dbConnect from './_Connect';
import Candidature from './_Candidature';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { id } = req.query;
  await dbConnect();
  try {
    const deletedCandidature = await Candidature.findByIdAndDelete(id);
    if (!deletedCandidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }
    res.status(200).json({ message: 'Candidature supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la candidature', error });
  }
}