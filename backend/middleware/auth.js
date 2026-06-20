// middleware/auth.js
// isLoggedIn  → protects private routes
// isAdmin     → admin-only routes
// setLocals   → injects currentUser + flash into every EJS view

const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  req.session.returnTo = req.originalUrl;
  req.session.flash = { type: "error", message: "Please login first" };
  res.redirect("/auth/login");
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.userRole === "admin") return next();
  req.session.flash = { type: "error", message: "Admin access required" };
  res.redirect("/");
};

const setLocals = (req, res, next) => {
  res.locals.currentUser = req.session.userId
    ? {
        id: req.session.userId,
        name: req.session.userName,
        username: req.session.userUsername,
        avatar: req.session.userAvatar,
        role: req.session.userRole,
      }
    : null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
};

module.exports = { isLoggedIn, isAdmin, setLocals };