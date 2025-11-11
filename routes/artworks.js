const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork");


router.get("/", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 0;

    const artworks = await Artwork.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(artworks);
  } catch (err) {
    console.error("GET Error:", err);
    res.status(500).json({ message: "Failed to fetch artworks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, artist, category, image, ...rest } = req.body;

    if (!title || !artist || !category || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newArtwork = new Artwork({
      title,
      artist,
      category,
      image,
      ...rest,
    });

    await newArtwork.save();

    res.status(201).json({
      message: "Artwork added successfully!",
      artwork: newArtwork,
    });
  } catch (err) {
    console.error("POST Error:", err);
    res.status(500).json({ message: "Failed to add artwork" });
  }
});

module.exports = router;
