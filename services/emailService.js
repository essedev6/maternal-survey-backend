const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email with the provided options
 * @param {Object} mailOptions - Email options
 * @param {string} mailOptions.from - Sender address
 * @param {string|string[]} mailOptions.to - Recipient(s)
 * @param {string} mailOptions.subject - Subject line
 * @param {string} mailOptions.text - Plain text body
 * @param {string} mailOptions.html - HTML body
 * @returns {Promise<void>}
 */
const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: mailOptions.from || `"Maternal Survey" <${process.env.EMAIL_USER}>`,
      ...mailOptions,
    });
    
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send survey completion notification
 * @param {Object} response - Survey response
 * @returns {Promise<void>}
 */
const sendSurveyCompletionEmail = async (response) => {
  const mailOptions = {
    to: process.env.ADMIN_EMAIL,
    subject: 'New Maternal Nutrition Survey Submission',
    html: `
      <h1>New Survey Response Received</h1>
      <p><strong>Date:</strong> ${new Date(response.createdAt).toLocaleString()}</p>
      <p><strong>Age Group:</strong> ${response.demographics.age}</p>
      <p><strong>Location:</strong> ${response.demographics.location}</p>
      <p><strong>Nutrition Knowledge:</strong> ${response.nutritionKnowledge.selfRating}</p>
      <hr>
      <p>View complete response in the admin dashboard.</p>
    `,
  };

  return sendEmail(mailOptions);
};

module.exports = {
  sendEmail,
  sendSurveyCompletionEmail,
};