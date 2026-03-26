const mongoose = require("mongoose");

const hotlineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name of the Hotline"],
  },
  description: {
    type: String,
    required: [true, "Please provide description of the Hotline"],
  },
  hours: {
    type: String,
    required: [true, "Please provide hours of the Hotline"],
  },
  staff: {
    type: String,
    required: [true, "Please provide staff of the Hotline"],
  },
  phone: {
    type: String,
    required: [true, "Please provide contact of Hotline"],
  },
  web: {
    type: String,
    required: [true, "Please provide webLink of the Hotline"],
  },
});

module.exports = mongoose.model("Hotline", hotlineSchema);
