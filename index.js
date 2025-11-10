const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
  try {
    await client.connect();
    const db = client.db("artify-db");
    const bannerCollection = db.collection("artify"); //Banner
    const artworkCollection = db.collection("artworks"); // artworks

    app.get("/api/banners", async (req, res) => {
      const banners = await bannerCollection.find().toArray();
      res.json(banners);
    });

    app.get("/api/artworks", async (req, res) => {
      try {
        let limit = parseInt(req.query.limit) || 0; // return all data
        const artworks = await artworkCollection
          .find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray();
        res.json(artworks);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch artworks" });
      }
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

run();
