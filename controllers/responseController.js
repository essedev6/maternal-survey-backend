// controllers/responseController.js

const Response = require('../models/Response');

// GET all survey responses
const getAllResponses = async (req, res) => {
  try {
    const responses = await Response.find().sort({ createdAt: -1 });
    res.status(200).json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Server error while fetching responses.' });
  }
};

module.exports = {
  getAllResponses,
};
