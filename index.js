const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Artwork = require("./models/Artwork");
const User = require("./models/User");

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

const artworkRoutes = require("./routes/artworks");
app.use("/api/artworks", artworkRoutes);

const statsRoutes = require("./routes/stats");
app.use("/api/stats", statsRoutes);


app.get("/api/banners", async (req, res) => {
  try {
    const Banner = mongoose.connection.db.collection("artify");
    const banners = await Banner.find().toArray();
    res.json(banners);
  } catch (err) {
    console.error("Failed to fetch banners:", err);
    res.status(500).json({ message: "Failed to fetch banners" });
  }
});


app.get("/api/all-artworks", async (req, res) => {
  try {
    const Artwork = mongoose.model("Artworks");
    let limit = parseInt(req.query.limit) || 0;
    const artworks = await Artwork.find().sort({ createdAt: -1 }).limit(limit);
    res.json(artworks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch artworks" });
  }
});

// Mongoose Connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "artify-db" })
  .then(() => console.log("MongoDB connected via Mongoose"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const path = require("path");


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}