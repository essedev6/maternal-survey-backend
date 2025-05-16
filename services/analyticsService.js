const Response = require('../models/Response');
const logger = require('../utils/logger');

/**
 * Get survey response statistics
 * @returns {Promise<Object>} Analytics data
 */
const getSurveyAnalytics = async () => {
  try {
    const [totalResponses, ageDistribution, experienceRatings] = await Promise.all([
      Response.countDocuments(),
      Response.aggregate([
        { $group: { _id: '$demographics.age', count: { $sum: 1 } } }
      ]),
      Response.aggregate([
        { $group: { _id: '$experienceRating', count: { $sum: 1 } } }
      ]),
    ]);

    return {
      totalResponses,
      ageDistribution,
      experienceRatings,
    };
  } catch (error) {
    logger.error('Analytics generation failed:', error);
    throw new Error('Failed to generate analytics');
  }
};

/**
 * Get nutrition knowledge statistics
 * @returns {Promise<Object>} Knowledge analytics
 */
const getNutritionKnowledgeStats = async () => {
  try {
    return await Response.aggregate([
      {
        $facet: {
          knowledgeLevels: [
            { $group: { 
              _id: '$nutritionKnowledge.selfRating', 
              count: { $sum: 1 } 
            }}
          ],
          supplementUsage: [
            { $group: { 
              _id: '$nutritionKnowledge.prenatalSupplements.takes', 
              count: { $sum: 1 } 
            }}
          ],
          foodGroupAwareness: [
            { $unwind: '$nutritionKnowledge.importantFoodGroups' },
            { $group: { 
              _id: '$nutritionKnowledge.importantFoodGroups', 
              count: { $sum: 1 } 
            }}
          ]
        }
      }
    ]);
  } catch (error) {
    logger.error('Nutrition stats failed:', error);
    throw new Error('Failed to generate nutrition stats');
  }
};

module.exports = {
  getSurveyAnalytics,
  getNutritionKnowledgeStats,
};