const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  // Informations personnelles
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profession: { type: String, required: true },
  villeResidence: { type: String, required: true },

  // Projet immobilier
  typeBienRecherche: {
    type: String,
    enum: ['Appartement', 'Villa', 'Terrain', 'Local commercial', 'Autre'],
    required: true
  },
  typeBienRechercheAutre: { type: String },
  
  typeServiceRecherche: {
    type: String,
    enum: [
      'Achat d\'un bien',
      'Construction clé en main',
      'Étude de projet',
      'Réaménagement / rénovation',
      'Autre'
    ],
    required: true
  },
  typeServiceRechercheAutre: { type: String },

  statutProjet: {
    type: String,
    enum: ['En réflexion', 'Recherche active'],
    required: true
  },
  delaiAchat: {
    type: String,
    enum: ['< 3 mois', '3-6 mois', '> 6 mois', null],
    default: null
  },
  localisationSouhaitee: { type: String, required: true },

  budget: {
    type: String,
    enum: ['< 150.000 TND', '150.000 – 250.000 TND', '250.000 – 400.000 TND', '> 400.000 TND', 'À définir'],
    required: true
  },
  budgetDefini: { type: String },

  financement: {
    type: [String],
    enum: ['Comptant', 'Crédit bancaire', 'En cours de demande', 'Facilité de paiement'],
    required: true
  },

  sourceConnaissance: {
    type: String,
    enum: ['Réseaux sociaux', 'Recommandation', 'Publicité en ligne', 'Passage sur place', 'Autre'],
    required: true
  },
  sourceConnaissanceAutre: { type: String },

  // Winner status
  isWinner: { type: Boolean, default: false },
  winDate: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('Participant', participantSchema); 