const express = require("express");
const router = express.Router();
const { getChatResponse,getChatHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.post("/message", protect, getChatResponse);
router.get("/history", protect, getChatHistory); // New route

module.exports = router;