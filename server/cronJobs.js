const cron = require('node-cron');
const db = require("./db"); 
const { sendEmail, sendSMS } = require('./notificationService');

// Fonction pour vérifier et envoyer des campagnes
const checkAndSendCampaigns = async () => {
    try {
        // Vérifier les campagnes d'anniversaire
        const today = new Date();
        const month = today.getMonth() + 1; // Mois de 0 à 11
        const day = today.getDate();

        const [campaigns] = await db.query("SELECT * FROM campaigns WHERE trigger_event = 'anniversaire'");

        for (const campaign of campaigns) {
            const [clients] = await db.query(
                "SELECT * FROM clients WHERE MONTH(birthday) = ? AND DAY(birthday) = ? AND user_id = ?",
                [month, day, campaign.user_id]
            );

            for (const client of clients) {
                const message = campaign.message.replace("{name}", client.name);

                // Envoi d'une notification par email
                await sendEmail(client.email, campaign.name, message);

                // Envoi d'une notification par SMS
                //await sendSMS(client.phone, message);
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des campagnes:', error);
    }
};

// Planifier la tâche pour s'exécuter tous les jours à minuit
cron.schedule('0 0 * * *', checkAndSendCampaigns);

module.exports = { checkAndSendCampaigns };
