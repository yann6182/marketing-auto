// notificationService.js
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Vous pouvez utiliser d'autres services comme Yahoo, Outlook, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Configure Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};

const sendSMS = (to, message) => {
    return twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
    });
};

module.exports = {
    sendEmail,
    sendSMS,
};
