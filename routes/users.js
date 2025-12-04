const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const { name, email, photoURL, uid } = req.body;

    if (!email || !uid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists by uid or email
    let user = await User.findOne({ $or: [{ uid }, { email }] });

    if (user) {
      user.name = name || user.name;
      user.photoURL = photoURL || user.photoURL;
      await user.save();
      return res.status(200).json({ message: "User updated successfully", user });
    }

    // Create new user
    const newUser = new User({
      uid,
      name: name || "No Name",
      email,
      photoURL: photoURL || "",
      isGoogleUser: false,
    });

    await newUser.save();
    res.status(201).json({ message: "User saved successfully", user: newUser });
  } catch (err) {
    console.error("Error saving user:", err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "User already exists with this email or UID" });
    }
    res.status(500).json({ message: "Failed to save user" });
  }
});


router.post("/google", async (req, res) => {
  try {
    const { uid, name, email, photoURL } = req.body;

    if (!email || !uid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        name: name || "No Name",
        email,
        photoURL: photoURL || "",
        isGoogleUser: true,
        createdAt: new Date(),
      });

      await user.save();
    }

    res.status(201).json({ message: "Google user saved", user });
  } catch (err) {
    console.error("Google user save error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/google", async (req, res) => {
  try {
    const googleUsers = await User.find({ isGoogleUser: true });
    res.json(googleUsers);
  } catch (err) {
    console.error("Error fetching Google users:", err);
    res.status(500).json({ message: "Failed to fetch Google users" });
  }
});

module.exports = router;
