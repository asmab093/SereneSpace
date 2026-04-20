const Mood = require('../models/Mood');
const Recommendation = require('../models/Recommendation');

const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

exports.getWeeklyInsights = async (req, res) => {
    try {
        const userId = req.user.id;
        const { timeframe } = req.query;

        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        let endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        if (timeframe === 'lastWeek') {
            startDate.setDate(startDate.getDate() - 13);
            endDate.setDate(endDate.getDate() - 7);
        } else {
            startDate.setDate(startDate.getDate() - 6);
        }

        const rawMoods = await Mood.find({
            user: userId,
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: 1 });

        const cleanMoodsMap = new Map();
        rawMoods.forEach(m => {
            const dateStr = new Date(m.createdAt).toDateString();
            cleanMoodsMap.set(dateStr, m); 
        });
        
        const moods = Array.from(cleanMoodsMap.values());
        const uniqueDays = moods.map(m => new Date(m.createdAt).toDateString());

        const chartLocked = uniqueDays.length === 0;
        const summaryLocked = uniqueDays.length < 5;

        // ✅ NEW LOGIC: Store an array of dominant moods to handle ties
        let dominantMoods = []; 
        let recommendations = [];

        if (!summaryLocked && moods.length > 0) {
            const counts = {};
            moods.forEach(m => {
                counts[m.finalMood] = (counts[m.finalMood] || 0) + 1;
            });

            // Find the highest frequency count
            const maxCount = Math.max(...Object.values(counts));
            
            // Find ALL moods that share that highest frequency (handles ties!)
            dominantMoods = Object.keys(counts).filter(mood => counts[mood] === maxCount);

            // Fetch recommendations for ALL winning moods
            let rawRecs = [];
            for (const mood of dominantMoods) {
                // Grab just the first word (e.g., "Happy" from "Happy / Content") for better searching
                const moodKeyword = mood.split(/[\s/]+/)[0]; 
                const recs = await Recommendation.find({ 
                    category: { $regex: new RegExp(moodKeyword, "i") } 
                }).limit(5);
                rawRecs = [...rawRecs, ...recs];
            }

            // Remove any duplicate recommendations and shuffle them to create a perfect mixture!
            const uniqueRecsMap = new Map();
            rawRecs.forEach(r => uniqueRecsMap.set(r._id.toString(), r));
            
            recommendations = Array.from(uniqueRecsMap.values())
                .sort(() => 0.5 - Math.random()) // Shuffle the mixed tips
                .slice(0, 5); // Only send 5 max to the phone

            if (recommendations.length === 0) {
                recommendations = await Recommendation.find().limit(5);
            }
        }

        res.json({
            chartLocked,
            summaryLocked,
            dominantMoods, // ✅ Sending the Array of winners instead of a single string
            recommendations,
            totalLogs: uniqueDays.length,
            moodData: moods
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.logDailyMood = async (req, res) => {
    try {
        const userId = req.user.id;
        const { start, end } = getTodayRange();
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

exports.checkTodayLog = async (req, res) => {
    try {
        const { start, end } = getTodayRange();
        const existingLog = await Mood.findOne({
            user: req.user.id,
            createdAt: { $gte: start, $lte: end }
        });
        res.json({ canLog: !existingLog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

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