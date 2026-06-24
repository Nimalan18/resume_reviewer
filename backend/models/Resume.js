const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  strengths: {
    type: [String],
    required: true,
  },
  improvements: {
    type: [String],
    required: true,
  },
  summary: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', ResumeSchema);
