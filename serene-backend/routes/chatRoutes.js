const express = require("express");
const router = express.Router();
const {
  getChatResponse,
  getChatHistory,
  transcribeAudio,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");

// Configure where to store temporary audio files // Temporary folder for audio
const upload = multer({ dest: "uploads/" });

router.post("/message", protect, getChatResponse);
router.get("/history", protect, getChatHistory);
router.post("/transcribe", protect, upload.single("audio"), transcribeAudio);
module.exports = router;
