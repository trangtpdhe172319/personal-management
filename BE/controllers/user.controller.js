const mongoose = require("mongoose");
const User = require("../models/user.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer storage for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/avatars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    ext = ext.toLowerCase();
    cb(null, req.params.id + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG images are allowed"));
    }
  },
});

const fs = require("fs");
const path = require("path");

module.exports = {
  getAllUser: async (req, res) => {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  getUserById: async (req, res) => {
    try {
<<<<<<< Updated upstream
      let id = req.params.id;
      if (!id) {
        if (req.session && req.session.userId) {
          id = req.session.userId;
        } else {
          return res.status(400).json({
            message: "Id is require d",
          });
        }
      }
      if (!id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Invalid Id",
=======
      const id = req.params.id;
      if (!id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Id is required",
>>>>>>> Stashed changes
        });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.log("Error", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

<<<<<<< Updated upstream
  updateUser: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const allowedUpdates = [
        "mobileNumber",
        "address1",
        "address2",
        "country",
        "avatar",
      ];
      const updates = {};
      for (const key of allowedUpdates) {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      }

      const updatedUser = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Update user error:", error);
=======
  getCurrentUser: async (req, res) => {
    try {
      // Defensive check for req.account.id in case middleware is async
      if (!req.account || !req.account.id) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Missing user info" });
      }
      const userId = req.account.id;
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("getCurrentUser error:", error);
>>>>>>> Stashed changes
      return res.status(500).json({ message: "Internal server error" });
    }
  },

<<<<<<< Updated upstream
  uploadAvatarMiddleware: upload.single("avatar"),

  uploadAvatar: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { avatar: avatarPath },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        ...updatedUser.toObject(),
        avatar: avatarPath,
      });
    } catch (error) {
      console.error("Upload avatar error:", error);
=======
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      if (userId !== req.account.id) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update this user" });
      }
      const updateData = req.body;
      // Prevent password update here for security
      delete updateData.password;
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      }).select("-password");
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("updateUser error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  uploadAvatar: async (req, res) => {
    try {
      const userId = req.params.id;
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      if (userId !== req.account.id) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update this user" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      // Save file path to user avatar field
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatar: avatarPath },
        { new: true }
      ).select("-password");
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ avatar: updatedUser.avatar });
    } catch (error) {
      console.error("uploadAvatar error:", error);
>>>>>>> Stashed changes
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
