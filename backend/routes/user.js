// routes/users.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const ctrl = require("../controllers/userController");
const { isLoggedIn } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../public/uploads")),
  filename: (req, file, cb) =>
    cb(null, "avatar-" + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/search", isLoggedIn, ctrl.searchUsers);
router.get("/settings", isLoggedIn, ctrl.getEditProfile);
router.post("/settings", isLoggedIn, upload.single("avatar"), ctrl.postEditProfile);
router.get("/discover", isLoggedIn, ctrl.getSuggestedUsers);
router.post("/:id/follow", isLoggedIn, ctrl.toggleFollow);
router.get("/:username/followers", isLoggedIn, ctrl.getFollowers);
router.get("/:username/following", isLoggedIn, ctrl.getFollowing);
router.get("/:username", isLoggedIn, ctrl.getProfile);

module.exports = router;