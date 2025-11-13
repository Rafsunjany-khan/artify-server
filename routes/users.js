const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.post("/", async (req, res) => {
  try {
    const { name, email, photoURL, uid } = req.body;

    if (!email || !uid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(200).json({ message: "User already exists", user: existingUser });
    }

    const newUser = new User({ name, email, photoURL, uid });
    await newUser.save();
    res.status(201).json({ message: "User saved successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save user" });
  }
});

module.exports = router;
