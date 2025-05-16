const Response = require('../models/Response');
const sendEmail = require('../config/email');

exports.submitResponse = async (req, res) => {
  try {
    const response = new Response(req.body);
    await response.save();

   /* // Send email notification
    await sendEmail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Survey Response Received',
      html: `
        <h1>New Survey Submission</h1>
        <p>Age: ${response.demographics.age}</p>
        <p>Location: ${response.demographics.location}</p>
        <p>Nutrition Knowledge: ${response.nutritionKnowledge.selfRating}</p>
      `,
    });*/

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getResponses = async (req, res) => {
  try {
    const responses = await Response.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

exports.getResponse = async (req, res) => {
  try {
    const response = await Response.findById(req.params.id);
    if (!response) {
      return res.status(404).json({
        success: false,
        error: 'Response not found',
      });
    }
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};