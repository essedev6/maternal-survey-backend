const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
demographics: {
  age: String,
  maritalStatus: String,
  hasChildren: String,
 childrenCount:String, // <-- ADD THIS
  education: String,
  location: String,
  religion: String,
  religionOther:String
},
  culturalFactors: {
    culturalFoodImportance: String,
    beneficialPractices: String, // Accepting "yes"/"no"
    hasRestrictions: String, 
    restrictionsDetails:String,
   
    familyInfluence: String,
    followsRituals: String,  
    ritualsDescription :String     // Accepting "yes"/"no"
  },
  economicFactors: {
    employmentStatus: String,
    workType: String,
    workHours: String,
    income: String,
    dependents: String, // Accepting as string for now ("3" etc.)
    residenceType: String,
    foodExpenditure: String,
  },
  nutritionKnowledge: {
    receivedEducation: String, // Accepting "yes"/"no"
    selfRating: String,
    importantFoodGroups: [String],
    knownNutrients: [String],
    consumptionFrequency: {
      fruitsVeggies: String,
      wholeGrains: String,
      proteins: String,
      dairy: String,
    },
    fruitsVeggiesFrequency:String,
    wholeGrainsFrequency:String,
    proteinsFrequency:String,
    dairyFrequency:String,
    mealsPerDay: String,
    prenatalSupplements: [String],
    takesSupplements:String, // Accepts directly as an array
    physicalActivity: String,
    avoidedFoods: {
      list: [String] // Optional – will store whatever is sent
    },
    awareOfAvoidedFoods:String,
    avoidedFoodsList:String,
    awareOfRisks:String
  },
  experienceRating: {
    rating: Number,
    comment: String
  },
  analytics: {
    completionTime: Number,
    deviceType: String,
    browser: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Response', responseSchema);
