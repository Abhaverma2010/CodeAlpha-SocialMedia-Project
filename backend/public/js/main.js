
// ── Mobile Nav Toggle ──────────────────────────
function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("open");
}

// ── Toggle comment section per post ───────────
function toggleComments(postId) {
  const section = document.getElementById("comments-" + postId);
  if (!section) return;
  const isOpen = section.style.display !== "none";
  section.style.display = isOpen ? "none" : "block";
  if (!isOpen) {
    const input = section.querySelector("input[name='text']");
    if (input) input.focus();
  }
}

// ── Auto-dismiss flash messages ────────────────
document.addEventListener("DOMContentLoaded", () => {
  const flash = document.querySelector(".flash");
  if (flash) {
    setTimeout(() => {
      flash.style.transition = "opacity 0.5s";
      flash.style.opacity = "0";
      setTimeout(() => flash.remove(), 500);
    }, 4000);
  }

  // Like button animation
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      this.classList.toggle("liked");
    });
  });
});
EOF
Output