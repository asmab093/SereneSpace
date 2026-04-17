const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Excited', 'Happy/Relaxed', 'Neutral', 'Frustrated', 'Sad', 'Tired/Stressed', 'General'],
    required: true 
  },
  image: { type: String } // Optional: icon or image URL
});

module.exports = mongoose.model('Recommendation', recommendationSchema);