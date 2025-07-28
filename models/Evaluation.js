const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  extractionStats: {
    wordCount: Number,
    charCount: Number,
    lineCount: Number
  },
  scores: {
    clarity: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    innovation: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    feasibility: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    presentation: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    impact: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    theme_alignment: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    }
  },
  totalScore: {
    type: Number,
    min: 6,
    max: 60,
    required: true
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B', 'C'],
    required: true
  },
  feedbackSummary: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    required: true
  },
  keywords: [{
    type: String
  }],
  projectTitle: {
    type: String,
    required: true
  },
  projectSummary: {
    type: String,
    required: true
  },
  improvementSuggestions: [{
    type: String
  }],
  recommendedResources: [{
    type: String
  }],
  visualQualityComment: {
    type: String,
    required: true
  },
  pitchReadinessScore: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true // Add index for faster queries
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Evaluation', evaluationSchema);