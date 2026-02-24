const express = require("express");
const router = express.Router();
const { getRiskData } = require("../services/riskCalculator");

router.post("/check-risk", async (req, res) => {
  try {
    const { state, district } = req.body;

    const result = await getRiskData(req.body);

    res.json(result);
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
