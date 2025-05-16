// routes/responseRoute.js

const express = require('express');
const router = express.Router();
const { getAllResponses } = require('../controllers/responseController');

// GET /v1/responses - fetch all responses
router.get('/', getAllResponses);

module.exports = router;

