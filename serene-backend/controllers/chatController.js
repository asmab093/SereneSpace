const Groq = require("groq-sdk");
const Message = require("../models/Message");
const User = require("../models/User");
const fs = require("fs");

// 1. Fetch History
exports.getChatHistory = async (req, res) => {
  try {
    // Ensure req.user exists (from your protect middleware)
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }
    const history = await Message.find({ user: req.user.id }).sort({
      createdAt: 1, //Fetches all messages for the logged-in user in chronological order.
    });

    // Check if history is empty
    if (history.length === 0) {
      // Find the user to get their name
      const user = await User.findById(req.user.id);
      const userName = user ? user.username : "there";

      const welcomeMessage = {
        _id: "welcome-msg",
        text: `Hi ${userName}! I'm SereneBot, your mental health companion. I'm here to listen and support you. How are you feeling today?`,
        sender: "bot",
        createdAt: new Date(),
      };
      return res.status(200).json({ success: true, history: [welcomeMessage] });
    }
    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Send Message (Updated)
exports.getChatResponse = async (req, res) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const { message } = req.body;
    // A. Save User Message to DB
    await Message.create({
      user: req.user.id,
      text: message,
      sender: "user",
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are SereneBot, a compassionate mental health AI.Only stick to conversation realated to mental haelth. 
Strict Guidelines:
1. Keep responses concise (maximum 2-3 short paragraphs).
2. Use bullet points for advice (max 3 points).
3. Always end with a short, empathetic question to keep the user engaged.
4. Avoid long "Intro" and "Outro" text.
5. Focus on immediate, actionable support.`,
        },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
    });
    console.log(chatCompletion);

    const botReply =
      chatCompletion.choices[0]?.message?.content || "I'm listening.";
    // B. Save Bot Reply to DB
    await Message.create({
      user: req.user.id,
      text: botReply,
      sender: "bot",
    });

    res.status(200).json({ reply: botReply });
  } catch (error) {
    res.status(500).json({ message: "Error processing chat." });
  }
};

exports.transcribeAudio = async (req, res) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No audio file provided" });
    }

    console.log("🎙️ Sending file to Groq Whisper...");

    // ✅ THE SECRET SAUCE: 
    // We pass the stream but explicitly tell Groq "This is speech.m4a"
    const transcription = await groq.audio.transcriptions.create({
  file: await Groq.toFile(fs.createReadStream(req.file.path), 'speech.m4a'),
  model: "whisper-large-v3",
});

    // Clean up temp file from /uploads
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.log("📝 Transcription result:", transcription.text);
    res.status(200).json({ success: true, text: transcription.text });

  } catch (error) {
    // Detailed logging to catch API issues
    console.error("❌ Groq API Error:", error.response?.data || error.message);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.error?.message || error.message 
    });
  }
};