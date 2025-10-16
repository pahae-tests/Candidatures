import dbConnect from './_Connect';
import Candidature from './_Candidature';
import { verifyAuth } from '../../middlewares/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const user = verifyAuth(req, res);
  if (!user) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  await dbConnect();
  try {
    const candidatures = await Candidature.find({ user: user._id });

    const headers = [
      'Entreprise',
      'Type d\'emploi',
      'Etat',
      'Date d\'envoi',
      'Contact',
      'Notes',
    ].join(';') + '\r\n';

    const rows = candidatures.map(candidature => [
      `"${candidature.entreprise}"`,
      candidature.typeEmploi,
      candidature.etat.replace("é", "e"),
      new Date(candidature.dateEnvoi).toLocaleDateString('fr-FR'),
      `"${candidature.contact}"`,
      `"${candidature.notes}"`,
    ].join(';') + '\r\n').join('');

    const csvData = headers + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=candidatures.csv');
    res.status(200).send(csvData);

  } catch (error) {
    console.error("Erreur lors de la génération du CSV :", error);
    res.status(500).json({ message: 'Erreur lors de la génération du CSV', error });
  }
}
