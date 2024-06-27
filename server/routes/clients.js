const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const { MongoClient } = require('mongodb');
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

// Route pour ajouter un client
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Un email valide est requis'),
    body('phone').notEmpty().withMessage('Le téléphone est requis'),
    body('address').notEmpty().withMessage('L\'adresse est requise'),
    body('birthday').optional({ checkFalsy: true }).isDate().withMessage('Une date de naissance valide est requise')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address, birthday } = req.body;
    const userId = req.user.id;

    try {
      const db = await getDb();
      const newClient = {
        user_id: userId,
        name,
        email,
        phone,
        address,
        birthday
      };
      const result = await db.collection('clients').insertOne(newClient);
      newClient.id = result.insertedId;

      // Envoi d'une notification par email
      sendEmail(email, 'Client ajouté', `Bonjour ${name}, vous avez été ajouté en tant que client.`);

      // Envoi d'une notification par SMS
      //sendSMS(phone, `Bonjour ${name}, vous avez été ajouté en tant que client.`);

      res.status(201).json(newClient);
    } catch (error) {
      console.error('Erreur de base de données:', error);
      res.status(500).json({ error: 'Erreur de base de données' });
    }
  }
);

// Route pour récupérer les clients d'un utilisateur
router.get('/', async (req, res) => {
  const userId = req.user.id;

  try {
    const db = await getDb();
    const clients = await db.collection('clients').find({ user_id: userId }).toArray();
    res.status(200).json(clients);
  } catch (error) {
    console.error('Erreur de base de données:', error);
    res.status(500).json({ error: 'Erreur de base de données' });
  }
});

// Route pour mettre à jour un client
router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Un email valide est requis'),
    body('phone').notEmpty().withMessage('Le téléphone est requis'),
    body('address').notEmpty().withMessage('L\'adresse est requise'),
    body('birthday').optional({ checkFalsy: true }).isDate().withMessage('Une date de naissance valide est requise')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clientId = req.params.id;
    const { name, email, phone, address, birthday } = req.body;
    const userId = req.user.id;

    try {
      const db = await getDb();
      const updatedClient = {
        name,
        email,
        phone,
        address,
        birthday
      };

      const result = await db.collection('clients').updateOne(
        { _id: new MongoClient.ObjectId(clientId), user_id: userId },
        { $set: updatedClient }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Client non trouvé' });
      }

      updatedClient.id = clientId;
      updatedClient.user_id = userId;

      // Envoi d'une notification par email
      sendEmail(email, 'Client mis à jour', `Bonjour ${name}, votre profil a été mis à jour.`);

      // Envoi d'une notification par SMS
      //sendSMS(phone, `Bonjour ${name}, votre profil a été mis à jour.`);

      res.status(200).json(updatedClient);
    } catch (error) {
      console.error('Erreur de base de données:', error);
      res.status(500).json({ error: 'Erreur de base de données' });
    }
  }
);

// Route pour supprimer un client
router.delete('/:id', async (req, res) => {
  const clientId = req.params.id;
  const userId = req.user.id;

  try {
    const db = await getDb();
    const client = await db.collection('clients').findOne({ _id: new MongoClient.ObjectId(clientId), user_id: userId });

    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }

    const { email, phone, name } = client;

    await db.collection('clients').deleteOne({ _id: new MongoClient.ObjectId(clientId), user_id: userId });

    // Envoi d'une notification par email
    sendEmail(email, 'Client supprimé', `Bonjour ${name}, votre profil a été supprimé.`);

    // Envoi d'une notification par SMS
    //sendSMS(phone, `Bonjour ${name}, votre profil a été supprimé.`);

    res.status(200).json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    console.error('Erreur de base de données:', error);
    res.status(500).json({ error: 'Erreur de base de données' });
  }
});

module.exports = router;
