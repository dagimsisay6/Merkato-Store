const router = require("express").Router();
const { signup, signin, getMe, forgotPassword, validateResetToken, resetPassword } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Simple in-memory rate limiter for forgot-password (5 requests per IP per 15 min)
const rateLimitMap = new Map();
function forgotPasswordRateLimit(req, res, next) {
  const key = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = 5;
  const entry = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + windowMs; }
  entry.count++;
  rateLimitMap.set(key, entry);
  if (entry.count > max) {
    return res.status(429).json({ message: "Too many requests. Please try again later." });
  }
  next();
}

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPasswordRateLimit, forgotPassword);
router.get("/validate-reset-token/:token", validateResetToken);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
