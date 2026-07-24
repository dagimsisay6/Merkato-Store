const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("../queries/users");
const { sendPasswordReset, sendOtpEmail } = require("../config/email");

const RESET_EXPIRES_MS = 15 * 60 * 1000;
const OTP_EXPIRES_MS   = 10 * 60 * 1000;

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ message: "Name, email and password are required." });

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await users.findByEmail(normalizedEmail);
    if (existing) return res.status(400).json({ message: "Email already in use." });

    const otp          = generateOtp();
    const passwordHash = await bcrypt.hash(password, 10);

    await users.setPendingSignup({
      email:        normalizedEmail,
      name:         name.trim(),
      passwordHash,
      otpHash:      hashOtp(otp),
      expiresAt:    new Date(Date.now() + OTP_EXPIRES_MS),
    });

    try {
      await sendOtpEmail({ name: name.trim(), email: normalizedEmail, otp });
    } catch (emailErr) {
      console.error("❌ OTP email failed:", emailErr.message);
      await users.deletePendingSignup(normalizedEmail);
      return res.status(500).json({ message: "Failed to send verification email. Please try again." });
    }

    res.status(201).json({ message: "otp_sent", email: normalizedEmail });
  } catch (err) {
    next(err);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

    const normalizedEmail = email.toLowerCase().trim();
    const pending = await users.findPendingSignup(normalizedEmail);

    if (pending) {
      if (pending.otp_hash !== hashOtp(String(otp).trim()))
        return res.status(400).json({ message: "Invalid or expired code. Please try again." });

      await users.createVerified({ name: pending.name, email: normalizedEmail, passwordHash: pending.password_hash });
      await users.deletePendingSignup(normalizedEmail);
      return res.json({ message: "Email verified successfully." });
    }

    // Fallback: legacy unverified user already in DB
    const user = await users.findByOtp(hashOtp(String(otp).trim()));
    if (!user || user.email.toLowerCase() !== normalizedEmail)
      return res.status(400).json({ message: "Invalid or expired code. Please try again." });

    await users.markVerified(user.id);
    res.json({ message: "Email verified successfully." });
  } catch (err) {
    next(err);
  }
}

async function resendOtp(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const normalizedEmail = email.toLowerCase().trim();
    const pending = await users.findPendingSignup(normalizedEmail);

    if (!pending) return res.json({ message: "otp_sent" }); // prevent enumeration

    const otp = generateOtp();
    await users.setPendingSignup({
      email:        normalizedEmail,
      name:         pending.name,
      passwordHash: pending.password_hash,
      otpHash:      hashOtp(otp),
      expiresAt:    new Date(Date.now() + OTP_EXPIRES_MS),
    });

    try {
      await sendOtpEmail({ name: pending.name, email: normalizedEmail, otp });
    } catch (emailErr) {
      console.error("❌ Resend OTP email failed:", emailErr.message);
      return res.status(500).json({ message: "Failed to send verification email. Please try again." });
    }

    res.json({ message: "otp_sent" });
  } catch (err) {
    next(err);
  }
}

async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await users.findByEmail(email);
    if (!user || !(await users.comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (!user.is_verified) {
      const otp = generateOtp();
      await users.setOtp(user.id, hashOtp(otp), new Date(Date.now() + OTP_EXPIRES_MS));
      sendOtpEmail({ name: user.name, email: user.email, otp }).catch(() => {});
      return res.status(403).json({ message: "unverified", email: user.email });
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

    const SAFE_MSG = "If an account with that email exists, we've sent a password reset link.";

    const user = await users.findByEmail(email);
    if (!user) return res.json({ message: SAFE_MSG });

    const rawToken  = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires   = new Date(Date.now() + RESET_EXPIRES_MS);

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
    if (!password || password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters." });

    const tokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await users.findByResetToken(tokenHash);
    if (!user) return res.status(400).json({ message: "Invalid or expired reset link." });

    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) return res.status(400).json({ message: "New password cannot be the same as your current password." });

    const newHash = await bcrypt.hash(password, 10);
    await users.clearResetToken(user.id, newHash);

    res.json({ message: "Your password has been successfully updated." });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, signin, getMe, forgotPassword, validateResetToken, resetPassword, verifyOtp, resendOtp };
