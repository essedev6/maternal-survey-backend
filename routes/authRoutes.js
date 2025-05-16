const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login); // Only login route for the admin

module.exports = router;
