// models/Post.js
// ─────────────────────────────────────────────
// Post schema with:
//   - author reference
//   - image (optional)
//   - likes array (user IDs) — toggle like/unlike
//   - comments as embedded subdocuments
// ─────────────────────────────────────────────

const mongoose = require("mongoose");

// Comment is embedded inside Post (no separate collection)
// Good for small, tightly coupled data like comments
const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional image upload
    image: {
      type: String,
      default: null,
    },
    caption: {
      type: String,
      required: [true, "Caption is required"],
      maxlength: 2200,
      trim: true,
    },
    // Likes: array of user IDs who liked this post
    // Using array lets us check if current user liked it and show count
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Comments as embedded subdocuments
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Helper: check if a given userId has liked this post
postSchema.methods.isLikedBy = function (userId) {
  return this.likes.some((id) => id.toString() === userId.toString());
};

module.exports = mongoose.model("Post", postSchema);