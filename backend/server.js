const express = require("express");
const cors = require("cors");
require("dotenv").config();

const riskRoute = require("./routes/risk");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", riskRoute);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend is running! Go to /api/check-risk for POST requests.");
});