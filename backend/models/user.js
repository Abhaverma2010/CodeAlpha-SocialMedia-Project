// models/User.js
// ─────────────────────────────────────────────
// Core user schema with:
//   - bcrypt password hashing (pre-save hook)
//   - followers / following arrays (for follow system)
//   - profile picture + bio
// ─────────────────────────────────────────────

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9_.]+$/, "Username can only contain letters, numbers, _ and ."],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 160,
    },
    avatar: {
      type: String,
      default: "/images/default-avatar.png",
    },
    // Who follows this user
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // Who this user follows
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// 🔐 Compare entered password with hash
userSchema.methods.comparePassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

// Helper: check if a given userId follows this user
userSchema.methods.isFollowedBy = function (userId) {
  return this.followers.some((f) => f.toString() === userId.toString());
};

module.exports = mongoose.model("User", userSchema);