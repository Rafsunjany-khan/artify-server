const express = require("express");
const router = express.Router();

const Artwork = require("../models/Artwork");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const totalArtworks = await Artwork.countDocuments();
    const totalMembers = await User.countDocuments();

    const allArtworks = await Artwork.find({}, "likes");
    const totalLikes = allArtworks.reduce(
      (sum, art) => sum + (art.likes?.length || 0),
      0
    );

    res.json({
      totalArtworks,
      totalLikes,
      totalMembers,
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
