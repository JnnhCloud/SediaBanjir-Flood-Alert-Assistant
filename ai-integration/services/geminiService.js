const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generativeAdvice(riskData) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are a Malaysian flood risk advisory system.

    Respond in ${riskData.language === "bm" ? "Bahasa Malaysia" : "English"}.

    Location:
    ${riskData.location.full || riskData.location.area}

    Risk Level: ${riskData.riskLevel}
    Risk Score: ${riskData.riskScore}/100

    Water Metrics:
    - Current Level: ${riskData.metrics.waterLevel}m
    - Danger Threshold: ${riskData.metrics.threshold}m
    - Percentage of Threshold: ${riskData.metrics.percentageOfThreshold}%
    - Exceed Amount: ${riskData.metrics.exceedMeters}m
    - Trend: ${riskData.metrics.trend}
    - Last Updated: ${riskData.metrics.hoursSinceUpdate} hours ago

    Weather:
    - Thunderstorm Active: ${riskData.weather.thunderstormActive}

    Nearest Monitoring Station:
    ${riskData.station.name}
    Distance: ${riskData.station.distanceKm} km

    Provide:
    1. Short risk explanation
    2. Immediate action advice
    3. Who should evacuate
    4. Reassurance if risk is low

    Keep it clear and practical.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

module.exports = { generativeAdvice };