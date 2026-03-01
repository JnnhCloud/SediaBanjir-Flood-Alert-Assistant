const express = require("express");
const cors = require("cors");
require("dotenv").config();

const riskRoute = require("./routes/risk");
const adviceRoute = require("./routes/advice");

const app = express();

// Enable CORS for frontend (Vercel) and local dev
const allowedOrigins = [
  "https://sedia-banjir-frontend.vercel.app/",  // production frontend
  "http://localhost:5173"        // dev frontend (adjust port if needed)
];

const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (like curl/Postman)
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error("CORS not allowed"), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
};

// Use CORS globally
app.use(cors(corsOptions));

// Make sure Express responds to preflight requests automatically
app.options("*", cors(corsOptions));

// Body parser
app.use(express.json());

// Route mounting
app.use("/api/risk", riskRoute);
app.use("/api/advice", adviceRoute);

// Test route
app.get("/api/hello", (req, res) => {
  res.send("Hello from merged backend!");
});

// Cloud Run port. Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});