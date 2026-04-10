const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  group: { type: String, required: true }, // e.g., 'anxiety'
  content: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }], 
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);