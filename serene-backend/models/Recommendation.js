const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    
    enum: [
      'Excited', 'Happy/Relaxed', 'Neutral', 'Frustrated', 'Sad', 'Tired/Stressed', 'General',
      'daily_uplift', 'mindful_moments', 'reset_recharge' 
    ],
    required: true 
  },
  image: { type: String } 
});

module.exports = mongoose.model('Recommendation', recommendationSchema);