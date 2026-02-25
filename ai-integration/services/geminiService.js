const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generativeAdvice(riskData) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are a flood emergency assistant.

    Respond in ${riskData.language === "bm" ? "Bahasa Malaysia" : "English"}.

    Location: ${riskData.location}
    Risk Level: ${riskData.riskLevel}
    Water Level: ${riskData.station?.waterLevel} meters
    Trend: ${riskData.station?.trend}
    Thunderstorm Active: ${riskData.weather?.thunderstormActive}

    Explain the situation in simple language suitable for the public.
    Provide:
    1. Short explanation
    2. Preparation checklist
    3. Evacuation advice if necessary    
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

module.exports = { generativeAdvice };