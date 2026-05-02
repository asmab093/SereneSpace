const axios = require("axios");

const classifyMessage = async (text) => {
  // ---------------------------------------------------------
  // 🛡️ FIRST: Check for strict keywords, but don't exit yet!
  // ---------------------------------------------------------
  const textLower = text.toLowerCase();
  const crisisKeywords = [
    "jump off","jump from", "kill", "suicide", "end it", "harm","pills", 
    "death", "overdose", "taking my own life", "disappear permanently",
    "hurt myself", "end it all tonight", "can't go on", "no reason to live", "done with life", "goodbye forever","want to die"
  ];
  
  // This evaluates to true if a dangerous word is found
  const keywordTriggeredCrisis = crisisKeywords.some(word => textLower.includes(word));

  if (keywordTriggeredCrisis) {
    console.log("🚨 SAFETY TRIGGER: Critical keyword detected! Forcing crisis mode.");
  }

  // ---------------------------------------------------------
  // 🧠 SECOND: Ask the AI for specific categories and nuances
  // ---------------------------------------------------------
  try {
    console.log("🚀 Calling Space API Directly for:", text);

    const submitRes = await axios.post(
      "https://asmab093-serene-ai-api.hf.space/gradio_api/call/predict",
      { data: [text] },
      { 
        headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
        timeout: 15000 // 15 seconds timeout
      }
    );

    const eventId = submitRes.data.event_id;
    if (!eventId) throw new Error("No Event ID received from Space");

    let aiResults = null;
    let attempts = 0;

    // ✅ CHECK FOR DATA
    while (!aiResults && attempts < 15) {
      const resultRes = await axios.get(
        `https://asmab093-serene-ai-api.hf.space/gradio_api/call/predict/${eventId}`,
        { headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` } }
      );

      const responseText = resultRes.data;

      // Safe parsing to prevent crashes
      if (responseText && typeof responseText === "string") {
        if (responseText.includes("event: complete")) {
          const lines = responseText.split("\n");
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("event: complete")) {
              const dataLine = lines[i + 1];
              if (dataLine && dataLine.startsWith("data: ")) {
                const jsonStr = dataLine.replace("data: ", "");
                aiResults = JSON.parse(jsonStr)[0];
                break;
              }
            }
          }
        }
      }

      if (!aiResults) {
        // ✅ WAIT LONGER: Spacing out requests
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        attempts++;
      }
    }

    if (aiResults) {
      console.log(`📊 AI RAW: Category: ${aiResults.category_label}, Suicide: ${aiResults.suicide_label}, Score: ${aiResults.suicide_score}`);
      
      return {
        // Grab specific category from AI, or default to generic "crisis" if only keywords triggered it
        category: aiResults.category_label?.toLowerCase() || (keywordTriggeredCrisis ? "crisis" : "normal"),
        
        // ⬅️ MAGIC: Crisis if AI says so (backward logic: non-suicide), OR if strict keywords caught it
        isCrisis: keywordTriggeredCrisis || (aiResults.suicide_label === "non-suicide"), 
        
        crisisScore: keywordTriggeredCrisis ? 1.0 : (aiResults.suicide_score || 0)
      };
    }
    throw new Error("AI Space timed out");

  } catch (error) {
    // ✅ 1. EMERGENCY FALLBACK: API Failed, rely strictly on our keyword flag
    if (keywordTriggeredCrisis) {
        console.log("⚠️ EMERGENCY FALLBACK: API Failed, but keywords safely detected a crisis!");
        return { 
          category: "crisis", 
          isCrisis: true, 
          crisisScore: 1.0 
        };
    }

    // ✅ 2. Only print the scary API error if it was a normal conversation that failed
    console.error("❌ API Error:", error.message);

    return {
        category: "normal",
        isCrisis: false, 
        crisisScore: 0
    };
  }
};

module.exports = { classifyMessage };