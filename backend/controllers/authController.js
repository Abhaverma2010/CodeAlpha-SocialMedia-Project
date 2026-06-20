// controllers/authController.js
// Register → Login → Logout
// Sessions store userId, userName, userUsername, userAvatar, userRole

const User = require("../models/User");

// ── REGISTER ──────────────────────────────────
exports.getRegister = (req, res) =>
  res.render("auth/register", { title: "Create Account" });

exports.postRegister = async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.session.flash = { type: "error", message: "Passwords don't match" };
      return res.redirect("/auth/register");
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      req.session.flash = {
        type: "error",
        message: exists.email === email ? "Email already registered" : "Username taken",
      };
      return res.redirect("/auth/register");
    }

    const user = await User.create({ name, username, email, password });
    _setSession(req, user);

    req.session.flash = { type: "success", message: `Welcome to Vibe, @${user.username}! 🎉` };
    res.redirect("/feed");
  } catch (err) {
    console.error(err);
    req.session.flash = { type: "error", message: "Registration failed" };
    res.redirect("/auth/register");
  }
};

// ── LOGIN ──────────────────────────────────────
exports.getLogin = (req, res) =>
  res.render("auth/login", { title: "Login" });

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      req.session.flash = { type: "error", message: "Invalid email or password" };
      return res.redirect("/auth/login");
    }

    _setSession(req, user);
    req.session.flash = { type: "success", message: `Welcome back, @${user.username}!` };

    const returnTo = req.session.returnTo || "/feed";
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (err) {
    req.session.flash = { type: "error", message: "Login failed" };
    res.redirect("/auth/login");
  }
};

// ── LOGOUT ─────────────────────────────────────
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/auth/login"));
};

// ── HELPER: save user info to session ──────────
function _setSession(req, user) {
  req.session.userId = user._id;
  req.session.userName = user.name;
  req.session.userUsername = user.username;
  req.session.userAvatar = user.avatar;
  req.session.userRole = user.role;
}