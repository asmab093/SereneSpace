const Mood = require('../models/Mood');
const Recommendation = require('../models/Recommendation');

/**
 * Helper: Get the start and end of the current calendar day
 * This ensures users can log once per date, regardless of the exact hour.
 */
const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

// ✅ 1. Get Weekly Insights
exports.getWeeklyInsights = async (req, res) => {
    try {
        const userId = req.user.id;
        const { timeframe } = req.query; // Expected: 'thisWeek' or 'lastWeek'

        let startDate = new Date();
        let endDate = new Date();

        if (timeframe === 'lastWeek') {
            // Range: 14 days ago to 7 days ago
            startDate.setDate(startDate.getDate() - 14);
            endDate.setDate(endDate.getDate() - 7);
        } else {
            // Range: Last 7 days
            startDate.setDate(startDate.getDate() - 7);
        }

        const moods = await Mood.find({
            user: userId,
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: 1 });

        // Group by unique dates to check the 5-day requirement
        const uniqueDays = [...new Set(moods.map(m => new Date(m.createdAt).toDateString()))];

        // ✅ REQUIREMENT: Lock chart/summary if less than 5 unique days are logged
        if (uniqueDays.length < 5) {
            return res.json({ 
                locked: true, 
                requiredDays: 5, 
                totalLogs: uniqueDays.length,
                message: "You have to log for at least 5 days for the chart and summary to be displayed."
            });
        }

        // Calculate Dominant Mood
        const counts = {};
        moods.forEach(m => {
            counts[m.finalMood] = (counts[m.finalMood] || 0) + 1;
        });
        const dominantMood = Object.keys(counts).reduce((a, b) => 
            counts[a] > counts[b] ? a : b
        );

        // Fetch Recommendations (Regex for case-insensitive matching)
        let recommendations = await Recommendation.find({ 
            category: { $regex: new RegExp(dominantMood, "i") } 
        }).limit(5);

        // Fallback recommendations if none match the specific mood
        if (recommendations.length === 0) {
            recommendations = await Recommendation.find().limit(5);
        }

        res.json({
            locked: false,
            dominantMood,
            recommendations,
            totalLogs: uniqueDays.length,
            moodData: moods
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ 2. Log Daily Mood (Enforces Once-Per-Day Rule)
exports.logDailyMood = async (req, res) => {
    try {
        const userId = req.user.id;
        const { start, end } = getTodayRange();

        // Check if a log already exists for today's calendar date
        const existingLog = await Mood.findOne({
            user: userId,
            createdAt: { $gte: start, $lte: end }
        });

        if (existingLog) {
            return res.status(403).json({ 
                success: false, 
                message: "You have already logged your mood today. Please come back tomorrow! 🌟" 
            });
        }

        const { scores, finalMood, averageScore } = req.body;
        const newMood = new Mood({
            user: userId,
            scores,
            finalMood,
            averageScore
        });

        await newMood.save();
        res.status(201).json({ success: true, data: newMood });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ 3. Check Today's Log Status
exports.checkTodayLog = async (req, res) => {
    try {
        const { start, end } = getTodayRange();
        
        const existingLog = await Mood.findOne({
            user: req.user.id,
            createdAt: { $gte: start, $lte: end }
        });

        // canLog is true if NO log was found for today
        res.json({ canLog: !existingLog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ 4. Fetch General Recommendations
exports.getGeneralRecommendations = async (req, res) => {
    try {
        const recommendations = await Recommendation.find({ 
            category: { $in: ['daily_uplift', 'mindful_moments', 'reset_recharge'] } 
        });
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};