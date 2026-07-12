const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("../queries/users");
const { sendPasswordReset } = require("../config/email");

const RESET_EXPIRES_MS = 15 * 60 * 1000; // 15 minutes

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existing = await users.findByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already in use" });
    const user = await users.create({ name, email, password });
    const token = signToken(user.id);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
}

async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await users.findByEmail(email);
    if (!user || !(await users.comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken(user.id);
    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res) {
  res.json({ user: req.user });
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Always return the same message to prevent email enumeration
    const SAFE_MSG = "If an account with that email exists, we've sent a password reset link.";

    const user = await users.findByEmail(email);
    if (!user) return res.json({ message: SAFE_MSG });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires = new Date(Date.now() + RESET_EXPIRES_MS);

    await users.setResetToken(user.id, tokenHash, expires);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    await sendPasswordReset({ email: user.email, resetUrl, expiresMinutes: 15 });

    res.json({ message: SAFE_MSG });
  } catch (err) {
    next(err);
  }
}

async function validateResetToken(req, res, next) {
  try {
    const tokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await users.findByResetToken(tokenHash);
    if (!user) return res.status(400).json({ valid: false, message: "Invalid or expired reset link." });
    res.json({ valid: true });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const tokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await users.findByResetToken(tokenHash);
    if (!user) return res.status(400).json({ message: "Invalid or expired reset link." });

    // Prevent reuse of the same password
    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) return res.status(400).json({ message: "New password cannot be the same as your current password." });

    const newHash = await bcrypt.hash(password, 12);
    await users.clearResetToken(user.id, newHash);

    res.json({ message: "Your password has been successfully updated." });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, signin, getMe, forgotPassword, validateResetToken, resetPassword };
