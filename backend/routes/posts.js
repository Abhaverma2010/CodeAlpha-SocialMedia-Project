// routes/posts.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const ctrl = require("../controllers/postController");
const { isLoggedIn } = require("../middleware/auth");

// Multer for post image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../public/uploads")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Images only")),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.get("/feed", isLoggedIn, ctrl.getFeed);
router.get("/explore", isLoggedIn, ctrl.getExplore);
router.get("/new", isLoggedIn, ctrl.getNewPost);
router.post("/", isLoggedIn, upload.single("image"), ctrl.createPost);
router.post("/:id/like", isLoggedIn, ctrl.toggleLike);
router.post("/:id/comment", isLoggedIn, ctrl.addComment);
router.post("/:postId/comments/:commentId/delete", isLoggedIn, ctrl.deleteComment);
router.delete("/:id", isLoggedIn, ctrl.deletePost);

module.exports = router;