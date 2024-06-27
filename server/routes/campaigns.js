const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const { MongoClient, ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');
const { sendEmail, sendSMS } = require('../notificationService');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

router.use(authenticateToken);

// Fonction pour obtenir la connexion à la base de données
async function getDb() {
  const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db(dbName);
}

// Route pour ajouter une campagne
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Le nom de la campagne est requis'),
    body('message').notEmpty().withMessage('Le message de la campagne est requis'),
    body('trigger_event').notEmpty().withMessage('L\'événement déclencheur est requis')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, message, trigger_event } = req.body;
    const userId = req.user.id;

    try {
      const db = await getDb();
      const collection = db.collection('campaigns');
      const result = await collection.insertOne({
        user_id: userId,
        name,
        message,
        trigger_event
      });

      res.status(201).json({ message: 'Campagne ajoutée avec succès', id: result.insertedId });
    } catch (error) {
      console.error('Erreur de base de données:', error);
      res.status(500).json({ error: 'Erreur de base de données' });
    }
  }
);

// Route pour récupérer les campagnes d'un utilisateur
router.get('/', async (req, res) => {
  const userId = req.user.id;

  try {
    const db = await getDb();
    const collection = db.collection('campaigns');
    const campaigns = await collection.find({ user_id: userId }).toArray();

    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Erreur de base de données:', error);
    res.status(500).json({ error: 'Erreur de base de données' });
  }
});

// Route pour mettre à jour une campagne
router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Le nom de la campagne est requis'),
    body('message').notEmpty().withMessage('Le message de la campagne est requis'),
    body('trigger_event').notEmpty().withMessage('L\'événement déclencheur est requis')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const campaignId = req.params.id;
    const { name, message, trigger_event } = req.body;
    const userId = req.user.id;

    try {
      const db = await getDb();
      const collection = db.collection('campaigns');
      const result = await collection.updateOne(
        { _id: new ObjectId(campaignId), user_id: userId },
        { $set: { name, message, trigger_event } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Campagne non trouvée' });
      }

      res.status(200).json({ message: 'Campagne mise à jour avec succès' });
    } catch (error) {
      console.error('Erreur de base de données:', error);
      res.status(500).json({ error: 'Erreur de base de données' });
    }
  }
);

// Route pour supprimer une campagne
router.delete('/:id', async (req, res) => {
  const campaignId = req.params.id;
  const userId = req.user.id;

  try {
    const db = await getDb();
    const collection = db.collection('campaigns');
    const result = await collection.deleteOne({ _id: new ObjectId(campaignId), user_id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Campagne non trouvée' });
    }

    res.status(200).json({ message: 'Campagne supprimée avec succès' });
  } catch (error) {
    console.error('Erreur de base de données:', error);
    res.status(500).json({ error: 'Erreur de base de données' });
  }
});

module.exports = router;
