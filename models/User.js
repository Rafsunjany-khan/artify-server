const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String },
  createdAt: { type: Date, default: Date.now },
  isGoogleUser: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema, "users");