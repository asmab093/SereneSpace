const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ["user", "bot"],
    required: true,
  },
  // ⬅️ NEW: Tell Mongoose it's okay to save the AI category
  detectedCategory: {
    type: String,
    default: "normal"
  },
  // ⬅️ NEW: The crucial flag for your 15-minute cooldown timer!
  isSuicidal: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);