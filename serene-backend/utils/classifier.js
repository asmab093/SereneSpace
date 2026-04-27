const axios = require("axios");

const classifyMessage = async (text) => {
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
        category: aiResults.category_label?.toLowerCase() || "normal",
        isCrisis: aiResults.suicide_label === "non-suicide", 
        crisisScore: aiResults.suicide_score || 0
      };
    }
    throw new Error("AI Space timed out");

  } catch (error) {
    // ✅ 1. Check for crisis keywords immediately if API fails
    const textLower = text.toLowerCase();
    const crisisKeywords = [
      "jump", "kill", "suicide", "end it", "harm", "balcony", "pills", 
      "death", "overdose", "taking my own life", "disappear permanently"
    ];
    
    const containsCrisis = crisisKeywords.some(word => textLower.includes(word));

    if (containsCrisis) {
        console.log("⚠️ EMERGENCY FALLBACK: API Failed, but keywords safely detected a crisis!");
        return { 
          category: "crisis", // Explicitly set to "crisis" so your DB knows exactly what to fetch
          isCrisis: true, 
          crisisScore: 1.0 
        };
    }

    // ✅ 3. Only print the scary API error if it was a normal conversation that failed
    console.error("❌ API Error:", error.message);

    return {
        category: "normal",
        isCrisis: false, 
        crisisScore: 0
    };
  }
};

module.exports = { classifyMessage };