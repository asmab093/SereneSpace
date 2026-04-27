const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    unique: true // Values: 'stress', 'anxiety', 'depression', 'crisis'
  },
  cloudinaryUrl: { 
    type: String, 
    required: true 
  }
});

module.exports = mongoose.model("Video", VideoSchema);