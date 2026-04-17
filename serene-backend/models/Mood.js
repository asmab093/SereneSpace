const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scores: {
    q1: { type: Number, required: true }, // Energy
    q2: { type: Number, required: true }, // Anxiety
    q3: { type: Number, required: true }, // Depression
    q4: { type: Number, required: true }, // Stress
    q5: { type: Number, required: true }, // Self-Esteem
    q6: { type: Number, required: true }, // Social
    q7: { type: Number, required: true }  // Irritability
  },
  averageScore: {
    type: Number,
    required: true
  },
  finalMood: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mood', MoodSchema);