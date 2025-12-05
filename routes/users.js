const express = require("express");
const router = express.Router();
const User = require("../models/User");

const saveOrUpdateUser = async ({ uid, name, email, photoURL, isGoogleUser }) => {
  let user = await User.findOne({ email });
  if (user) {
    user.uid = uid;
    user.name = name || user.name;
    user.photoURL = photoURL || user.photoURL;
    if (isGoogleUser) user.isGoogleUser = true;
    await user.save();
    return { user, created: false };
  }

  const newUser = new User({
    uid,
    name: name || "No Name",
    email,
    photoURL: photoURL || "",
    isGoogleUser: isGoogleUser || false,
  });

  await newUser.save();
  return { user: newUser, created: true };
};

router.post("/", async (req, res) => {
  try {
    const { uid, name, email, photoURL } = req.body;
    if (!uid || !email) return res.status(400).json({ message: "Missing required fields" });

    const { user, created } = await saveOrUpdateUser({ uid, name, email, photoURL, isGoogleUser: false });
    res.status(created ? 201 : 200).json({ message: created ? "User saved successfully" : "User updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/google", async (req, res) => {
  try {
    const { uid, name, email, photoURL } = req.body;
    if (!uid || !email) return res.status(400).json({ message: "Missing required fields" });

    const { user, created } = await saveOrUpdateUser({ uid, name, email, photoURL, isGoogleUser: true });
    res.status(created ? 201 : 200).json({ message: created ? "Google user created" : "Google user updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save Google user", error: err });
  }
});

router.put("/update", async (req, res) => {
  try {
    const { uid, name, email, photoURL } = req.body;
    if (!uid) return res.status(400).json({ message: "UID required" });

    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { name, email, photoURL },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

module.exports = router;
