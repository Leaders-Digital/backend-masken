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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #fff;">
          <div style="padding: 0; margin: 0;">
            <div style="padding: 24px 0 0 0; text-align: center;">
              <span style="font-size: 2.2rem; font-weight: bold; color: #1a8cff; letter-spacing: 1px;">masken</span>
            </div>
            <div style="height: 6px; background: linear-gradient(90deg, #1a8cff 0%, #e23b6d 100%); margin: 18px 0 0 0;"></div>
          </div>
          <div style="padding: 36px 32px 24px 32px; text-align: center;">
            <h2 style="font-size: 1.5rem; color: #222; margin-bottom: 18px; font-weight: 600;">Votre confirmation d'inscription à la newsletter,<br>a été prise en compte !</h2>
            <p style="color: #444; font-size: 1.1rem; margin-bottom: 24px;">Merci d'avoir rempli notre formulaire. Nous avons bien reçu vos informations :</p>
            <ul style="list-style: none; padding: 0; margin: 0 0 24px 0; text-align: left; display: inline-block;">
              <li><strong>Nom:</strong> ${participant.nom}</li>
              <li><strong>Prénom:</strong> ${participant.prenom}</li>
              <li><strong>Email:</strong> ${participant.email}</li>
              <li><strong>Téléphone:</strong> ${participant.telephone}</li>
              <li><strong>Budget:</strong> ${participant.budget}</li>
            </ul>
            <p style="color: #666; font-size: 1rem;">Notre équipe va étudier votre demande et vous contactera dans les plus brefs délais.</p>
          </div>
          <div style="background: #f7f7f7; padding: 18px 32px; text-align: center; color: #888; font-size: 0.98rem; border-top: 1px solid #eee;">
            Merci pour l'intérêt que vous nous portez,<br>cordialement l'équipe<br><span style="font-weight: bold; color: #1a8cff;">Masken</span>
          </div>
        </div>
      ` // Modern, image-inspired design
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