const Groq = require("groq-sdk");
const axios = require("axios");
const Message = require("../models/Message");
const User = require("../models/User");
const Video = require("../models/Video"); 
const fs = require("fs");
const { classifyMessage } = require("../utils/classifier"); 

exports.getChatHistory = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authorized" });
    
    let history = await Message.find({ user: req.user.id }).sort({ createdAt: 1 });

    // ✅ NEW: If the user has no history, create and return an initial welcome message
    if (history.length === 0) {
      const welcomeMessage = await Message.create({
        user: req.user.id,
        text: "Hi! I'm SereneBot, your compassionate mental health companion. How are you feeling today?",
        sender: "bot"
      });
      history = [welcomeMessage];
    }

    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChatResponse = async (req, res) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  try {
    const { message } = req.body;
    
    let { category, isCrisis, crisisScore } = await classifyMessage(message);
    
    const lowerCategory = category.toLowerCase();
    const isMentalHealthIssue = ["stress", "anxiety", "depression"].includes(lowerCategory);

    // Save the message to a variable to exclude it from the cooldown check
    const savedUserMessage = await Message.create({
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

      // 🕒 15-MINUTE COOLDOWN LOGIC
      let smsSuccessfullySent = false;
      const FIFTEEN_MINUTES = 15 * 60 * 1000;
      const cutoffTime = new Date(Date.now() - FIFTEEN_MINUTES);

      const recentCrisis = await Message.findOne({
        user: req.user.id,
        isSuicidal: true,
        createdAt: { $gte: cutoffTime },
        _id: { $ne: savedUserMessage._id } 
      });

      if (recentCrisis) {
        console.log("⏳ Cooldown active: Emergency alert was already sent within the last 15 minutes. Skipping WhatsApp API.");
      } else {
        // 🚨 NO RECENT CRISIS: FIRE THE WHATSAPP ALERT
        try {
          const currentUser = await User.findById(req.user.id);
          
          if (currentUser && currentUser.emergencyContact && currentUser.emergencyContact.phone) {
            const contact = currentUser.emergencyContact;
            let fullPhoneNumber = `${contact.countryCode}${contact.phone}`.replace("+", "");
            const patientName = currentUser.username || "A user"; 

            const whatsappPayload = {
              messaging_product: "whatsapp",
              to: fullPhoneNumber,
              type: "template",
              template: {
                name: "emergency_alert_v1", 
                language: { code: "en" },
                components: [
                  {
                    type: "body",
                    parameters: [
                      {
                        type: "text",
                        parameter_name: "user_name",
                        text: patientName 
                      }
                    ]
                  }
                ]
              }
            };

            await axios.post(
              `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
              whatsappPayload,
              {
                headers: {
                  Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                  "Content-Type": "application/json",
                },
              }
            );
            
            console.log(`✅ WhatsApp Alert successfully sent to ${fullPhoneNumber}`);
            smsSuccessfullySent = true; 
          } else {
            console.log("⚠️ Crisis detected, but user has no emergency contact saved.");
          }
        } catch (apiError) {
          console.error("❌ Failed to send WhatsApp Alert:", apiError.response?.data || apiError.message);
        }
      }

      return res.status(200).json({ 
        reply: crisisReply,
        triggerCrisisModal: true, 
        scenarioType: scenarioType, 
        videoUrl: videoUrl,
        detectedCategory: lowerCategory,
        alertSent: smsSuccessfullySent 
      });
    }

    const basePrompt = `You are SereneBot, a compassionate and concise mental health AI operating in Islamabad, Pakistan. 
    CRITICAL LENGTH INSTRUCTION: Keep all responses brief, warm, and engaging. Do not write long paragraphs; limit responses to 4-6 short sentences or 3-4 brief bullet points.
    CRITICAL SAFETY INSTRUCTION: If you provide emergency contacts or resources, ONLY provide Pakistani resources (e.g., Umang Pakistan: 0311-7786264, Rozan: 0800-22444, Edhi Ambulance: 115). Never provide US numbers like 911, 988, or 1-800-273-TALK. Keep the conversation focused strictly on mental health.`;
    
    let systemPrompt = "";
    if (isMentalHealthIssue) {
      systemPrompt = basePrompt + `The user is feeling ${lowerCategory}. Use CBT techniques to challenge negative thoughts, give 3 actionable tips, and end with an empathetic question.`;
    } else {
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