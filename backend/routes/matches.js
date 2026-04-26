const express = require("express");
const axios   = require("axios");
const router  = express.Router();

const ML_SERVICE = "http://localhost:8000";

// GET all matches
router.get("/matches", async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE}/matches`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

// GET players by match id
router.get("/matches/:match_id/players", async (req, res) => {
  try {
    const { match_id } = req.params;
    const response = await axios.get(
      `${ML_SERVICE}/matches/${match_id}/players`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

module.exports = router;