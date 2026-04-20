const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // Prevents duplicate emails
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"], // ✅ Added custom message
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  emergencyContact: {
    name: { type: String, default: "" },
    relation: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  hasAddedContact: {
    type: Boolean,
    default: false,
  },
  communityProfile: {
    bio: { type: String, default: "" },
    avatarId: { type: Number, default: null },
    hasCompletedProfile: { type: Boolean, default: false },
  },
  joinedGroups: [{ type: String }], // Array of group IDs like ['anxiety', 'adhd']
  resetPasswordOTP: String,
  resetPasswordExpires: Date,
});

// if you update a user's username but keep the same password, you don't
//  want to hash the password again. If you hash a hash, the user will
//  never be able to log in!
// Models/User.js

// The Correct Async Way (No 'next' argument needed)
userSchema.pre("save", async function () {
  console.log("--- DEBUG: User Model Pre-Save Middleware ---");

  // Only hash the password if it has been modified
  if (!this.isModified("password")) {
    console.log("Middleware: Password not modified. Proceeding...");
    return; // Just return; Mongoose will continue automatically
  }

  try {
    console.log("Middleware: Hashing new password...");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // No need to call next() here
  } catch (error) {
    console.error("Middleware Error:", error);
    throw error; // Throwing error will stop the save and trigger the catch block
  }
});

module.exports = mongoose.model("User", userSchema);