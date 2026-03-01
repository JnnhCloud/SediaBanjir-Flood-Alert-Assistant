const express = require("express");
const cors = require("cors");
require("dotenv").config();

const riskRoute = require("./routes/risk");
const adviceRoute = require("./routes/advice");

const app = express();

const allowedOrigins = [
  "https://project.vercel.app", // remove trailing slash!
  "http://localhost:5173"
];

const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (like curl, Postman, Render health checks)
    if (!origin) return callback(null, true);
    // allow only whitelisted origins, else reject silently
    callback(null, allowedOrigins.includes(origin));
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
};

// Use CORS globally
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
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