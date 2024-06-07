// sms.js
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSms = (to, body) => {
    client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
    })
    .then(message => console.log('SMS envoyé:', message.sid))
    .catch(error => console.error('Erreur lors de l\'envoi du SMS:', error));
};

module.exports = sendSms;
