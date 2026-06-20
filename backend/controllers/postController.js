// controllers/postController.js
// ─────────────────────────────────────────────
// Feed         → posts from people you follow + your own
// Create post  → with optional image upload
// Like/Unlike  → toggle like (uses $addToSet / $pull)
// Comment      → add comment to a post
// Delete       → author or admin only
// ─────────────────────────────────────────────

const Post = require("../models/Post");
const User = require("../models/User");

// ── FEED ──────────────────────────────────────
// Shows posts from: yourself + people you follow
// Sorted newest first — classic social media feed
exports.getFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.userId);
    const feedUserIds = [currentUser._id, ...currentUser.following];

    const posts = await Post.find({ author: { $in: feedUserIds } })
      .populate("author", "name username avatar")
      .populate("comments.author", "name username avatar")
      .sort({ createdAt: -1 })
      .limit(30);

    res.render("posts/feed", {
      title: "Your Feed",
      posts,
      currentUserId: req.session.userId,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
};

// ── EXPLORE ───────────────────────────────────
// All public posts — discover new people
exports.getExplore = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name username avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.render("posts/explore", {
      title: "Explore",
      posts,
      currentUserId: req.session.userId,
    });
  } catch (err) {
    res.redirect("/feed");
  }
};

// ── CREATE POST ────────────────────────────────
// GET /posts/new → show form
exports.getNewPost = (req, res) =>
  res.render("posts/new", { title: "New Post" });

// POST /posts → save post to DB
exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!caption && !image) {
      req.session.flash = { type: "error", message: "Add a caption or image" };
      return res.redirect("/posts/new");
    }

    await Post.create({ author: req.session.userId, caption, image });

    req.session.flash = { type: "success", message: "Post shared! ✨" };
    res.redirect("/feed");
  } catch (err) {
    console.error(err);
    req.session.flash = { type: "error", message: "Could not create post" };
    res.redirect("/posts/new");
  }
};

// ── LIKE / UNLIKE ─────────────────────────────
// POST /posts/:id/like → toggle like
// Uses MongoDB $addToSet (won't duplicate) and $pull (removes)
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.redirect("/feed");

    const userId = req.session.userId;
    const alreadyLiked = post.isLikedBy(userId);

    if (alreadyLiked) {
      // Unlike: remove userId from likes array
      await Post.findByIdAndUpdate(req.params.id, {
        $pull: { likes: userId },
      });
    } else {
      // Like: add userId (won't duplicate due to $addToSet)
      await Post.findByIdAndUpdate(req.params.id, {
        $addToSet: { likes: userId },
      });
    }

    // Redirect back to wherever they were (feed, profile, explore)
    res.redirect(req.headers.referer || "/feed");
  } catch (err) {
    res.redirect("/feed");
  }
};

// ── COMMENT ───────────────────────────────────
// POST /posts/:id/comment → add a comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.redirect(req.headers.referer || "/feed");
    }

    await Post.findByIdAndUpdate(req.params.id, {
      $push: {
        comments: { author: req.session.userId, text: text.trim() },
      },
    });

    res.redirect(req.headers.referer || "/feed");
  } catch (err) {
    res.redirect("/feed");
  }
};

// ── DELETE COMMENT ────────────────────────────
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: { _id: commentId } },
    });
    res.redirect(req.headers.referer || "/feed");
  } catch (err) {
    res.redirect("/feed");
  }
};

// ── DELETE POST ───────────────────────────────
// Only author or admin can delete
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.redirect("/feed");

    const isOwner = post.author.toString() === req.session.userId.toString();
    const isAdmin = req.session.userRole === "admin";

    if (!isOwner && !isAdmin) {
      req.session.flash = { type: "error", message: "Not authorized" };
      return res.redirect("/feed");
    }

    await Post.findByIdAndDelete(req.params.id);
    req.session.flash = { type: "success", message: "Post deleted" };
    res.redirect(req.headers.referer || "/feed");
  } catch (err) {
    res.redirect("/feed");
  }
};