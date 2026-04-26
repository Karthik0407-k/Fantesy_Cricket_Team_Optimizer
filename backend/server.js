const express = require("express");
const cors = require("cors");
const matchesRouter = require("./routes/matches");
const predictRouter = require("./routes/predict");

const app = express();
const PORT = 5000;

// middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// routes
app.use("/api", matchesRouter);
app.use("/api", predictRouter);

// health check
app.get("/", (req, res) => {
  res.json({ message: "CricketXI Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
