const express = require('express');
const router = express.Router();
const {
  submitResponse,
  getResponses,
  getResponse,
} = require('../controllers/surveyController');
const { protect } = require('../middlewares/auth');

router.route('/')
  .post(submitResponse)
  .get(protect, getResponses);

router.route('/:id')
  .get(protect, getResponse);

module.exports = router;