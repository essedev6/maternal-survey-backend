const Response = require('../models/Response'); // Ensure this is present

const getSurveyAnalytics = async (req, res) => {
  try {
    // ✅ Get 5 most recent responses
    const recentResponses = await Response.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select({
        _id: 1,
        createdAt: 1,
        'demographics.age': 1,
        'demographics.education': 1,
        'nutritionKnowledge.selfRating': 1
      });

    // ✅ Get last updated grouped by full date
    const LastUpdated = await Response.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
      { $limit: 1 }
    ]);

    const totalResponses = await Response.countDocuments();
    const completedResponses = await Response.countDocuments({ 'analytics.completed': true });

    const completionRate = totalResponses > 0
      ? Math.round((completedResponses / totalResponses) * 100)
      : 0;

    const experienceRatings = await Response.aggregate([
      { $match: { 'experienceRating.rating': { $exists: true } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$experienceRating.rating' }
        }
      }
    ]);

    const incomeDistribution = await Response.aggregate([
      {
        $group: {
          _id: '$economicFactors.income',
          count: { $sum: 1 }
        }
      }
    ]);

      const employmentStatus = await Response.aggregate([
      {
        $group: {
          _id: '$economicFactors.employmentStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const culturalFactors = await Response.aggregate([
      {
        $group: {
          _id: '$culturalFactors.culturalFoodImportance',
          count: { $sum: 1 }
        }
      }
    ]);

    const responseTrends = await Response.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const demographics = await Response.aggregate([
      {
        $facet: {
          ageGroups: [
            { $group: { _id: '$demographics.age', count: { $sum: 1 } } }
          ],
          genderDistribution: [
            { $group: { _id: '$demographics.gender', count: { $sum: 1 } } }
          ],
            educationLevel: [
            { $group: { _id: '$demographics.education', count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    const nutritionKnowledge = await Response.aggregate([
      {
        $facet: {
          selfRating: [
            { $group: { _id: '$nutritionKnowledge.selfRating', count: { $sum: 1 } } }
          ],
          supplementUsage: [
            { $group: { _id: '$nutritionKnowledge.prenatalSupplements.takes', count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        recentResponses, // ✅ Newly added
        LastUpdated,
        totalResponses,
        averageExperienceRating: experienceRatings[0]?.averageRating || 0,
        completionRate,
        culturalFactors,
        incomeDistribution,
        employmentStatus,
        responseTrends,
        demographics: demographics[0] || { ageGroups: [], genderDistribution: [],  educationLevel: [] },
        nutritionKnowledge: nutritionKnowledge[0] || { selfRating: [], supplementUsage: [] }
      }
    });

  } catch (err) {
    console.error('Error in getSurveyAnalytics:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

module.exports = {
  getSurveyAnalytics,
  getNutritionKnowledgeStats: (req, res) => res.status(200).json({ message: 'Nutrition knowledge stats' }),
  getAdvancedAnalytics: (req, res) => res.status(200).json({ message: 'Advanced analytics' }),
};
