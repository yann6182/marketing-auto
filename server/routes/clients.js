const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth'); 
const db = require("../db");
const { body, validationResult } = require('express-validator');
const { sendEmail, sendSMS } = require('../notificationService');

router.use(authenticateToken);

// Route pour ajouter un client
router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Le nom est requis'),
        body('email').isEmail().withMessage('Un email valide est requis'),
        body('phone').notEmpty().withMessage('Le téléphone est requis'),
        body('address').notEmpty().withMessage('L\'adresse est requise')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, address } = req.body;
        const userId = req.user.id;

        try {
            const query = "INSERT INTO clients (user_id, name, email, phone, address) VALUES (?, ?, ?, ?, ?)";
            await db.execute(query, [userId, name, email, phone, address]);

            // Envoi d'une notification par email
            await sendEmail(email, 'Client ajouté', `Bonjour ${name}, vous avez été ajouté en tant que client.`);

            // Envoi d'une notification par SMS
            //await sendSMS(phone, `Bonjour ${name}, vous avez été ajouté en tant que client.`);

            res.status(201).json({ message: 'Client ajouté avec succès' });
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
        const query = "SELECT * FROM clients WHERE user_id = ?";
        const [clients] = await db.query(query, [userId]);
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
        body('address').notEmpty().withMessage('L\'adresse est requise')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const clientId = req.params.id;
        const { name, email, phone, address } = req.body;
        const userId = req.user.id;

        try {
            const query = "UPDATE clients SET name = ?, email = ?, phone = ?, address = ? WHERE id = ? AND user_id = ?";
            await db.execute(query, [name, email, phone, address, clientId, userId]);

            // Envoi d'une notification par email
            await sendEmail(email, 'Client mis à jour', `Bonjour ${name}, votre profil a été mis à jour.`);

            // Envoi d'une notification par SMS
            //await sendSMS(phone, `Bonjour ${name}, votre profil a été mis à jour.`);

            res.status(200).json({ message: 'Client mis à jour avec succès' });
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
        // Récupération des informations du client avant suppression
        const [client] = await db.query("SELECT * FROM clients WHERE id = ? AND user_id = ?", [clientId, userId]);
        if (client.length === 0) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }

        const { email, phone, name } = client[0];

        const query = "DELETE FROM clients WHERE id = ? AND user_id = ?";
        await db.execute(query, [clientId, userId]);

        // Envoi d'une notification par email
        await sendEmail(email, 'Client supprimé', `Bonjour ${name}, votre profil a été supprimé.`);

        // Envoi d'une notification par SMS
        //await sendSMS(phone, `Bonjour ${name}, votre profil a été supprimé.`);

        res.status(200).json({ message: 'Client supprimé avec succès' });
    } catch (error) {
        console.error('Erreur de base de données:', error);
        res.status(500).json({ error: 'Erreur de base de données' });
    }
});

module.exports = router;
