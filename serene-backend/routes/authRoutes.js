const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");
const {addEmergencyContact,loginUser} = require("../controllers/authController");
const { updateUsername, updatePassword,forgotPassword,resetPassword } = require('../controllers/authController');

router.post("/register", registerUser);

router.put("/add-contact", addEmergencyContact); // Use PUT because we are updating an existing user

router.post("/login", loginUser); // ✅ New Login Route

router.put('/update-username', updateUsername);
router.put('/update-password', updatePassword); // Add this too for your password modal
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;