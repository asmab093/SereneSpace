const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");
const {addEmergencyContact,loginUser} = require("../controllers/authController");
const { updateUsername, updatePassword } = require('../controllers/authController');
//Axios had sent a POST request to
// http://10.0.2.2:5000/api/auth/register with data

router.post("/register", registerUser);

router.put("/add-contact", addEmergencyContact); // Use PUT because we are updating an existing user

router.post("/login", loginUser); // ✅ New Login Route

router.put('/update-username', updateUsername);
router.put('/update-password', updatePassword); // Add this too for your password modal

module.exports = router;
