const express = require("express");
const router = express.Router();
const { updateCommunityProfile, updateJoinedGroups } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware"); // Ensure you have auth middleware!

// All these routes require a logged-in user
router.put("/community-profile", protect, updateCommunityProfile);
router.put("/joined-groups", protect, updateJoinedGroups);

module.exports = router;