// server.js — Entry point
// Run: npm run dev
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const path = require("path");
const connectDB = require("./config/db");
const { setLocals } = require("./middleware/auth");

const app = express();
connectDB();

// ── View Engine ───────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

// ── Static Files ──────────────────────────────
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ── Middleware ────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// ── Sessions (stored in MongoDB) ──────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

// ── Global Locals for all EJS views ───────────
app.use(setLocals);

// ── Routes ────────────────────────────────────
app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/user"));

// Home: redirect to feed if logged in, else landing page
app.get("/", (req, res) => {
  if (req.session.userId) return res.redirect("/feed");
  res.render("landing", { title: "Vibe — Share Your World" });
});

// Shortcut: /feed and /explore at root level
app.get("/feed", (req, res) => res.redirect("/posts/feed"));
app.get("/explore", (req, res) => res.redirect("/posts/explore"));
app.get("/search", (req, res) => res.redirect(`/users/search?q=${req.query.q || ""}`));

// 404
app.use((req, res) =>
  res.status(404).render("error", { title: "404", message: "Page not found" })
);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { title: "Error", message: err.message || "Something went wrong" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Vibe running at http://localhost:${PORT}`);
});