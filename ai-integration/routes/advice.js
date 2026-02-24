const express = require("express");
const router = express.Router();
const { generativeAdvice } = require("../services/geminiService");

router.post("/generate-advice", async (req, res) => {
    try {
        const riskData = req.body;

        const advice = await generativeAdvice(riskData);

        res.json({ advice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI generative failed" });
    }
});

router.post("/generate-advice", (req, res) => {
  res.json({ advice: "AI service is receiving data!" });
});

module.exports = router;