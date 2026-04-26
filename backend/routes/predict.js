const express = require("express");
const axios = require("axios");
const router = express.Router();

const ML_SERVICE = "http://localhost:8000";

// POST predict best XI
router.post("/predict", async (req, res) => {
  try {
    const { match_id } = req.body;

    if (!match_id) {
      return res.status(400).json({ error: "match_id is required" });
    }

    const response = await axios.post(`${ML_SERVICE}/predict`, { match_id });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;
