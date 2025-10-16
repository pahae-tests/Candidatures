import mongoose from 'mongoose';

const candidatureSchema = new mongoose.Schema({
  entreprise: { type: String, required: true, trim: true },
  typeEmploi: { type: String, required: true, trim: true },
  etat: { type: String, required: true, trim: true },
  dateEnvoi: { type: Date, default: Date.now },
  contact: { type: String, required: true, trim: true },
  notes: { type: String, required: true, trim: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Candidature =
  mongoose.models.Candidature || mongoose.model('Candidature', candidatureSchema);

export default Candidature;