const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String },
    medium: { type: String },
    dimensions: { type: String },
    year: { type: Number },
    price: { type: Number },
    visibility: { type: String },
    userName: { type: String },
    userEmail: { type: String },

    likes: {
      type: [String],
      default: []
    },

    favorites: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artwork", artworkSchema);
