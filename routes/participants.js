const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const { sendWelcomeEmail } = require('../helpers/emailHelper');

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

// Delete all participants
router.delete('/all', async (req, res) => {
  try {
    await Participant.deleteMany({});
    res.json({ message: 'Tous les participants ont été supprimés' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create participant(s)
router.post('/', async (req, res) => {
  try {
    // Check if the request body is an array (bulk creation) or a single object
    const isBulk = Array.isArray(req.body);
    const participantsData = isBulk ? req.body : [req.body];
    
    // Create and save participants one by one
    const savedParticipants = [];
    for (const data of participantsData) {
      const participant = new Participant({
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        email: data.email,
        profession: data.profession,
        villeResidence: data.villeResidence,
        typeBienRecherche: data.typeBienRecherche,
        typeBienRechercheAutre: data.typeBienRechercheAutre,
        typeServiceRecherche: data.typeServiceRecherche,
        typeServiceRechercheAutre: data.typeServiceRechercheAutre,
        statutProjet: data.statutProjet,
        delaiAchat: data.delaiAchat,
        localisationSouhaitee: data.localisationSouhaitee,
        budget: data.budget,
        budgetDefini: data.budgetDefini,
        financement: data.financement,
        sourceConnaissance: data.sourceConnaissance,
        sourceConnaissanceAutre: data.sourceConnaissanceAutre
      });

      try {
        const savedParticipant = await participant.save();
        savedParticipants.push(savedParticipant);
        
        // Send welcome email
        try {
          await sendWelcomeEmail(savedParticipant);
        } catch (emailError) {
          console.error(`Failed to send welcome email to ${savedParticipant.email}:`, emailError);
          // Continue with the next participant even if email fails
        }
      } catch (saveError) {
        if (saveError.code === 11000) {
          throw new Error(`Un participant avec l'email ${data.email} existe déjà`);
        }
        throw saveError;
      }
    }

    res.status(201).json(isBulk ? savedParticipants : savedParticipants[0]);
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
      // Update only the fields that are provided
      const allowedFields = [
        'nom', 'prenom', 'telephone', 'email', 'profession', 'villeResidence',
        'typeBienRecherche', 'typeBienRechercheAutre', 'typeServiceRecherche',
        'typeServiceRechercheAutre', 'statutProjet', 'delaiAchat',
        'localisationSouhaitee', 'budget', 'budgetDefini', 'financement',
        'sourceConnaissance', 'sourceConnaissanceAutre'
      ];

      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          participant[field] = req.body[field];
        }
      });

      const updatedParticipant = await participant.save();
      res.json(updatedParticipant);
    } else {
      res.status(404).json({ message: 'Participant non trouvé' });
    }
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Un participant avec cet email existe déjà' });
    } else {
      res.status(400).json({ message: err.message });
    }
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

// Get today's participants for game
router.get('/game/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const participants = await Participant.find({
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ createdAt: -1 });

    res.json({ 
      participants,
      date: today.toISOString().split('T')[0]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get participants by date
router.get('/game/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const [participants, total] = await Promise.all([
      Participant.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ createdAt: -1 }),
      Participant.countDocuments({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      })
    ]);

    res.json({
      participants,
      currentPage: 1,
      totalPages: 1,
      totalItems: total,
      itemsPerPage: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 