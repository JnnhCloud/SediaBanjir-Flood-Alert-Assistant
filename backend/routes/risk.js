// Simple Test Route
// Test server works 
// Before touch gov API

// const express = require("express");
// const router = express.Router();

// router.post("/check-risk", async (req, res) => {
//     console.log("POST /api/check-risk hit!");
//     res.json({ message: "Server working!" });
// });


// module.exports = router;

// improved V2
// const express = require("express");
// const router = express.Router();

// const { getRiskData } = require("../services/riskCalculator");

// router.post("/check-risk", async (req, res) => {
//   try {
//     const { state, district } = req.body;

//     const result = await getRiskData(state, district);

//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// module.exports = router;

// IMPROVED V3
const express = require("express");
const router = express.Router();
const { getRiskData } = require("../services/riskCalculator");

router.post("/check-risk", async (req, res) => {
  try {
    const { state, district } = req.body;

    // UPDATE VERSION 4 GRR AFTER ADD 
    // distance.js
    // const result = await getRiskData(state, district);
    const result = await getRiskData(req.body);

    res.json(result);
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
