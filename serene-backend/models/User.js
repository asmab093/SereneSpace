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
});

// if you update a user's username but keep the same password, you don't
//  want to hash the password again. If you hash a hash, the user will
//  never be able to log in!
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // ⬅️ If password isn't changed, move to the next step
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error); // ⬅️ Pass the error to next if hashing fails
  }
});

module.exports = mongoose.model("User", userSchema);
