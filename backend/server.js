const express = require("express");
const cors = require("cors");
require("dotenv").config();

const riskRoute = require("./routes/risk");
const adviceRoute = require("./routes/advice");

const app = express();

// Enable CORS for frontend (Vercel) and local dev
const allowedOrigins = [
  "https://project.vercel.app",  // production frontend
  "http://localhost:5173"        // dev frontend (adjust port if needed)
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

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