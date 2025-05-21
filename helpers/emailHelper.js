const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Use the App Password here, not your regular Gmail password
  },
  debug: true, // Enable debug logging
  logger: true // Enable logger
});
console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP Configuration Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

const sendWelcomeEmail = async (participant) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email configuration is missing. Please check your environment variables.');
    }

    const mailOptions = {
      from: `"Masken" <${process.env.EMAIL_USER}>`,
      to: participant.email,
      subject: 'Bienvenue sur notre plateforme',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Bienvenue ${participant.prenom} ${participant.nom}!</h2>
          <p>Merci d'avoir rempli notre formulaire. Nous avons bien reçu vos informations :</p>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Nom:</strong> ${participant.nom}</li>
            <li><strong>Prénom:</strong> ${participant.prenom}</li>
            <li><strong>Email:</strong> ${participant.email}</li>
            <li><strong>Téléphone:</strong> ${participant.telephone}</li>
            <li><strong>Type de bien recherché:</strong> ${participant.typeDeBienRecherche}</li>
            <li><strong>Budget:</strong> ${participant.budget}</li>
          </ul>
          <p>Notre équipe va étudier votre demande et vous contactera dans les plus brefs délais.</p>
          <p>Cordialement,<br>L'équipe de Masken</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your email and app password configuration.');
    }
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail
}; 