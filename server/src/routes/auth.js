const router = require("express").Router();
const {
  signup, signin, getMe, forgotPassword,
  validateResetToken, resetPassword, verifyOtp, resendOtp,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

function makeRateLimiter(max, windowMs) {
  const map = new Map();
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const entry = map.get(key) || { count: 0, resetAt: now + windowMs };
    if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + windowMs; }
    entry.count++;
    map.set(key, entry);
    if (entry.count > max)
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    next();
  };
}

const signupRateLimit = makeRateLimiter(10, 60 * 60 * 1000); // 10 per hour
const signinRateLimit = makeRateLimiter(10, 15 * 60 * 1000); // 10 per 15 min
const otpRateLimit    = makeRateLimiter(5,  10 * 60 * 1000); // 5 per 10 min
const forgotRateLimit = makeRateLimiter(5,  15 * 60 * 1000); // 5 per 15 min

router.post("/signup",                     signupRateLimit, signup);
router.post("/verify-otp",                 otpRateLimit, verifyOtp);
router.post("/resend-otp",                 otpRateLimit, resendOtp);
router.post("/signin",                     signinRateLimit, signin);
router.get("/me",                          protect, getMe);
router.post("/forgot-password",            forgotRateLimit, forgotPassword);
router.get("/validate-reset-token/:token", validateResetToken);
router.post("/reset-password/:token",      resetPassword);

module.exports = router;
