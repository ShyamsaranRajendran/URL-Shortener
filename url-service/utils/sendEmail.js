// utils/sendEmail.js

const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure .env is loaded if not already

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // e.g. shyamsaran0206@gmail.com
    pass:"vyki efil wiww ybav" || process.env.EMAIL_PASS, // e.g. Gmail App Password
  }
});

/**
 * Send an email using Gmail and nodemailer
 * @param {string} to - recipient email
 * @param {string} subject - subject of the email
 * @param {string} text - plain text content
 * @param {string} html - optional HTML content
 */
async function sendEmail(to, subject, text, html = '') {
  const mailOptions = {
    from: `"Shortly" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html: html || text, // fallback to text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId} to ${to}`);
    return 'Email sent successfully';
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw new Error('Failed to send email');
  }
}

module.exports = sendEmail;
