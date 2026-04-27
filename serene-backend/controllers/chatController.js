const Groq = require("groq-sdk");
const Message = require("../models/Message");
const User = require("../models/User");
const Video = require("../models/Video"); 
const fs = require("fs");
const { classifyMessage } = require("../utils/classifier"); 

exports.getChatHistory = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authorized" });
    const history = await Message.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChatResponse = async (req, res) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  try {
    const { message } = req.body;
    
    // Get analysis from classifier
    let { category, isCrisis, crisisScore } = await classifyMessage(message);
    
    const lowerCategory = category.toLowerCase();
    const isMentalHealthIssue = ["stress", "anxiety", "depression"].includes(lowerCategory);

    // 1. Save User Message to Database
    await Message.create({
      user: req.user.id,
      text: message,
      sender: "user",
      detectedCategory: lowerCategory,
      isSuicidal: isCrisis 
    });

    // 🚨 SCENARIO 1 & 2: CRISIS DETECTED
    if (isCrisis) {
      const searchTag = isMentalHealthIssue ? lowerCategory : "crisis";
      const videoData = await Video.findOne({ category: searchTag });
      const videoUrl = videoData ? videoData.cloudinaryUrl : null;
      
      const scenarioType = isMentalHealthIssue ? "CRISIS_WITH_CATEGORY" : "CRISIS_ONLY";

      const crisisReply = "I'm deeply concerned by what you're sharing. Please stay with me and use the resources below.";
      
      await Message.create({ user: req.user.id, text: crisisReply, sender: "bot" });

      return res.status(200).json({ 
        reply: crisisReply,
        triggerCrisisModal: true, 
        scenarioType: scenarioType, 
        videoUrl: videoUrl,
        detectedCategory: lowerCategory 
      });
    }

    // 🧠 SCENARIO 3 & 4: NO CRISIS
    // Explicitly enforce Pakistan/Islamabad context to override Groq's default US safety responses
    const basePrompt = `You are SereneBot, a compassionate mental health AI operating in Islamabad, Pakistan. CRITICAL SAFETY INSTRUCTION: If you ever provide emergency contacts, mental health hotlines, or safety resources, you MUST ONLY provide Pakistani resources (e.g., Umang Pakistan: 0311-7786264, Rozan: 0800-22444, Edhi Ambulance: 115). NEVER provide US numbers like 911, 988, or 1-800-273-TALK. `;
    
    let systemPrompt = "";
    if (isMentalHealthIssue) {
      // Scenario 3: CBT Protocol
      systemPrompt = basePrompt + `The user is feeling ${lowerCategory}. Use CBT techniques to challenge negative thoughts, give 3 actionable tips, and end with an empathetic question.`;
    } else {
      // Scenario 4: Friendly/Normal Protocol
      systemPrompt = basePrompt + `The user is feeling okay. Maintain a supportive, lighthearted conversation.`;
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const botReply = chatCompletion.choices[0]?.message?.content || "I'm here for you.";
    await Message.create({ user: req.user.id, text: botReply, sender: "bot" });

    return res.status(200).json({ 
      reply: botReply, 
      triggerCrisisModal: false, 
      detectedCategory: lowerCategory 
    });

  } catch (error) {
    console.error("Chat Logic Error:", error);
    res.status(500).json({ message: "Error processing request." });
  }
};

exports.transcribeAudio = async (req, res) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No audio file provided" });
    const transcription = await groq.audio.transcriptions.create({
      file: await Groq.toFile(fs.createReadStream(req.file.path), 'speech.m4a'),
      model: "whisper-large-v3",
    });
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(200).json({ success: true, text: transcription.text });
  } catch (error) {
    console.error("❌ Transcription Error:", error.message);
    res.status(500).json({ success: false, message: "Speech recognition failed." });
  }
};