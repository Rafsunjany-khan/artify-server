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

// ArtworkDetails page
router.get("/:id", async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }
    res.json(artwork);
  } catch (err) {
    console.error("GET /:id Error:", err);
    res.status(500).json({ message: "Failed to fetch artwork details" });
  }
});

// Update artwork by ID
// Update artwork by ID
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      artist,
      category,
      image,
      description,
      medium,
      dimensions,
      price,
      visibility,
      userName,
      userEmail,
    } = req.body;

    // Build the update object
    const updateData = {
      title,
      artist,
      category,
      image,
      description,
      medium,
      dimensions,
      price,
      visibility,
      userName,
      userEmail,
    };

    // Remove undefined fields (if not provided in req.body)
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.json({ message: "Artwork updated successfully!", artwork: updatedArtwork });
  } catch (err) {
    console.error("PUT /:id Error:", err);
    res.status(500).json({ message: "Failed to update artwork" });
  }
});

module.exports = router;
