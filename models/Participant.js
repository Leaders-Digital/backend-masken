const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telephone: {
    type: String,
    required: true,
    unique: true,
  },
  AdressePostale:{
    type: String,
    required: true,
  },
  statusActuel:{
    type: String,
    enum: ['Propriétaire', 'Locataire','Acheteur','Locataire potentiel',"Autre"],
    default: '',
  },
  autre : {
    type: String,
    required: false,
  },
  typeDeBienRecherche:{
    type: String,
    enum: ['Appartement', 'Maison', 'Terrain', 'Autre'],
    default: '',
  },
  budget:{
    type: String,
    required: false,
  },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Participant', participantSchema); 