const express = require("express");
const cors = require("cors");
require("dotenv").config();

const riskRoute = require("./routes/risk");
const adviceRoute = require("./routes/advice");

const app = express();
app.use(cors());
app.use(express.json());

// Route mounting
app.use("/api/risk", riskRoute);
app.use("/api/advice", adviceRoute);

// Test route
app.get("/api/hello", (req, res) => {
  res.send("Hello from merged backend!");
});

// Cloud Run port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});