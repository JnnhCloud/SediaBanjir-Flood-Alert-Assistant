const express = require("express");
const cors = require("cors");
require("dotenv").config();

const adviceRoute = require("./routes/advice");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", adviceRoute);

const PORT = 6000;

//test get
app.get("/api/hello", (req, res) => {
  res.send("Hello from AI server!");
});

app.listen(PORT, () => {
    console.log(`AI Service running on port ${PORT}`);
});

