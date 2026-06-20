// controllers/userController.js
// ─────────────────────────────────────────────
// User profiles, follow/unfollow, edit profile,
// followers/following lists, user search
// ─────────────────────────────────────────────

const User = require("../models/User");
const Post = require("../models/Post");

// ── PROFILE PAGE ──────────────────────────────
// GET /users/:username → view any user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("followers", "name username avatar")
      .populate("following", "name username avatar");

    if (!user) {
      req.session.flash = { type: "error", message: "User not found" };
      return res.redirect("/feed");
    }

    // Get all their posts
    const posts = await Post.find({ author: user._id })
      .populate("author", "name username avatar")
      .populate("comments.author", "name username avatar")
      .sort({ createdAt: -1 });

    // Check if current logged-in user follows this profile
    const isFollowing = user.isFollowedBy(req.session.userId);
    const isOwnProfile = user._id.toString() === req.session.userId.toString();

    res.render("users/profile", {
      title: `@${user.username}`,
      profileUser: user,
      posts,
      isFollowing,
      isOwnProfile,
      currentUserId: req.session.userId,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/feed");
  }
};

// ── FOLLOW / UNFOLLOW ─────────────────────────
// POST /users/:id/follow → toggle follow
// Updates BOTH users: add to target's followers, add to current user's following
exports.toggleFollow = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.redirect("/feed");

    const myId = req.session.userId;

    // Can't follow yourself
    if (targetUser._id.toString() === myId.toString()) {
      return res.redirect(req.headers.referer || "/feed");
    }

    const isFollowing = targetUser.isFollowedBy(myId);

    if (isFollowing) {
      // Unfollow: remove from both sides
      await User.findByIdAndUpdate(targetUser._id, { $pull: { followers: myId } });
      await User.findByIdAndUpdate(myId, { $pull: { following: targetUser._id } });
    } else {
      // Follow: add to both sides
      await User.findByIdAndUpdate(targetUser._id, { $addToSet: { followers: myId } });
      await User.findByIdAndUpdate(myId, { $addToSet: { following: targetUser._id } });
    }

    // Update session avatar in case it changed
    res.redirect(req.headers.referer || `/users/${targetUser.username}`);
  } catch (err) {
    res.redirect("/feed");
  }
};

// ── EDIT PROFILE ──────────────────────────────
// GET /users/settings → edit form
exports.getEditProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render("users/edit-profile", { title: "Edit Profile", profileUser: user });
  } catch (err) {
    res.redirect("/feed");
  }
};

// POST /users/settings → save changes
exports.postEditProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updateData = { name, bio };

    // If new avatar uploaded
    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
      req.session.userAvatar = updateData.avatar; // update session too
    }

    const user = await User.findByIdAndUpdate(req.session.userId, updateData, { new: true });

    // Keep session in sync
    req.session.userName = user.name;

    req.session.flash = { type: "success", message: "Profile updated!" };
    res.redirect(`/users/${user.username}`);
  } catch (err) {
    req.session.flash = { type: "error", message: "Update failed" };
    res.redirect("/users/settings");
  }
};

// ── SEARCH USERS ──────────────────────────────
// GET /search?q=abha → search by name or username
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    let users = [];

    if (q && q.trim()) {
      users = await User.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { username: { $regex: q, $options: "i" } },
        ],
      }).limit(20);
    }

    res.render("users/search", { title: "Search People", users, query: q || "" });
  } catch (err) {
    res.redirect("/feed");
  }
};

// ── FOLLOWERS / FOLLOWING LISTS ───────────────
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("followers", "name username avatar bio");
    res.render("users/follow-list", {
      title: `${user.name}'s Followers`,
      listTitle: "Followers",
      users: user.followers,
      profileUser: user,
    });
  } catch (err) {
    res.redirect("/feed");
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("following", "name username avatar bio");
    res.render("users/follow-list", {
      title: `${user.name} is Following`,
      listTitle: "Following",
      users: user.following,
      profileUser: user,
    });
  } catch (err) {
    res.redirect("/feed");
  }
};

// ── SUGGESTED USERS ───────────────────────────
// People you don't follow yet (excluding yourself)
exports.getSuggestedUsers = async (req, res) => {
  try {
    const me = await User.findById(req.session.userId);
    const excluded = [me._id, ...me.following];

    const suggested = await User.find({ _id: { $nin: excluded } })
      .select("name username avatar bio followers")
      .limit(10);

    res.render("users/suggested", { title: "Discover People", users: suggested });
  } catch (err) {
    res.redirect("/feed");
  }
};