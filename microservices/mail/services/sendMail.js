require('dotenv').config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendRegisterMail(email) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Registratie voltooid",
    text: "Je bent succesvol geregistreerd! 🎉"
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 E-mail verzonden naar ${email}`);
  } catch (err) {
    console.error("❌ Fout bij verzenden van e-mail:", err);
  }
}

module.exports = sendRegisterMail;