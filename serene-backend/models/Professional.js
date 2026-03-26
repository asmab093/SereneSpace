const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the professional's full name"], // ✅ Custom error message
    },
    expertise: {
      type: [String],
      required: [true, "Please list at least one area of expertise"],
    },
    years: {
      type: String,
      required: [true, "Please provide years of experience"],
    },
    fee: {
      type: String,
      required: [true, "Please provide the session fee"],
    },
    location: {
      type: String,
      required: [true, "Please provide the clinic/hospital location"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide a valid Cloudinary image URL"],
    },
    phone: { 
    type: String, 
    required: [true, "Please provide a contact number"] 
  },
  },
  { timestamps: true },
); // ✅ Good practice to keep track of when they were added/updated

module.exports = mongoose.model("Professional", professionalSchema);
