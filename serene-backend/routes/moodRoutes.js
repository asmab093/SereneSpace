const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');
const Tip = require('../models/Tips'); 

// Mood Logging & Insights
router.get('/check-today', protect, moodController.checkTodayLog);
router.post('/log', protect, moodController.logDailyMood);
router.get('/insights', protect, moodController.getWeeklyInsights);
router.get('/general-recommendations', protect, moodController.getGeneralRecommendations);

// Daily Tip Route
router.get('/daily-tip', async (req, res) => {
  try {
    const day = new Date().getDay();
    const tip = await Tip.findOne({ dayIndex: day });
    if (!tip) return res.status(404).json({ message: "No tip found" });
    res.json(tip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;