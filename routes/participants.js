const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');

// Get all participants
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const [participants, total] = await Promise.all([
      Participant.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Participant.countDocuments()
    ]);

    res.json({
      participants,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new participant
router.post('/', async (req, res) => {
  const participant = new Participant({
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    telephone: req.body.telephone,
    AdressePostale: req.body.AdressePostale,
    statusActuel: req.body.statusActuel,
    autre: req.body.autre,
    typeDeBienRecherche: req.body.typeDeBienRecherche,
    budget: req.body.budget
  });

  try {
    const newParticipant = await participant.save();
    res.status(201).json(newParticipant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get one participant
router.get('/:id', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (participant) {
      res.json(participant);
    } else {
      res.status(404).json({ message: 'Participant non trouvé' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update participant
router.patch('/:id', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (participant) {
      // Vérifier si le statusActuel est valide
      if (req.body.statusActuel && !['Propriétaire', 'Locataire', 'Acheteur', 'Locataire potentiel', 'Autre'].includes(req.body.statusActuel)) {
        return res.status(400).json({ message: 'Status actuel invalide' });
      }
      
      // Vérifier si le typeDeBienRecherche est valide
      if (req.body.typeDeBienRecherche && !['Appartement', 'Maison', 'Terrain', 'Autre'].includes(req.body.typeDeBienRecherche)) {
        return res.status(400).json({ message: 'Type de bien recherché invalide' });
      }

      Object.keys(req.body).forEach(key => {
        participant[key] = req.body[key];
      });
      
      const updatedParticipant = await participant.save();
      res.json(updatedParticipant);
    } else {
      res.status(404).json({ message: 'Participant non trouvé' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete participant
router.delete('/:id', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (participant) {
      await participant.deleteOne();
      res.json({ message: 'Participant supprimé' });
    } else {
      res.status(404).json({ message: 'Participant non trouvé' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 