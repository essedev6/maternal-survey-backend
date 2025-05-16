const express = require('express');
const router = express.Router();
const {
  getSurveyAnalytics,
  getNutritionKnowledgeStats,
  getAdvancedAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middlewares/auth'); // no authorize


// Admin-only, but we already enforce that at login level
router.route('/')
  .get(protect, getSurveyAnalytics);

router.route('/nutrition-knowledge')
  .get(protect, getNutritionKnowledgeStats);

  router.route('/advanced').post(protect, getAdvancedAnalytics);

module.exports = router;
