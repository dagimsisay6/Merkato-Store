const users = require("../queries/users");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const cloudinary = require("cloudinary").v2;
const { sendProfileUpdated, sendPasswordChanged } = require("../config/email");

// ── Profile ──────────────────────────────────────────────
async function getProfile(req, res) {
  res.json({ user: req.user });
}

async function uploadAvatar(req, res, next) {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ message: "No image data provided." });
    const result = await cloudinary.uploader.upload(data, {
      folder: "merkato/avatars",
      transformation: [{ width: 256, height: 256, crop: "fill", gravity: "face" }],
      resource_type: "image",
    });
    const user = await users.update(req.user.id, {
      name: req.user.name,
      phone: req.user.phone,
      avatar: result.secure_url,
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function removeAvatar(req, res, next) {
  try {
    const current = req.user.avatar;
    // Delete from Cloudinary if it's a Cloudinary URL
    if (current && current.includes("cloudinary.com")) {
      const publicId = current.split("/").slice(-2).join("/").replace(/\.[^.]+$/, "");
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
    const user = await users.update(req.user.id, {
      name: req.user.name,
      phone: req.user.phone,
      avatar: null,
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, phone, avatar, email } = req.body;
    const current = req.user;
    const changedFields = [];

    if (!name || !name.trim()) return res.status(400).json({ message: "Full name is required." });

    // Handle email change
    if (email && email.toLowerCase() !== current.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
      }
      const taken = await users.findByEmailExcluding(email, current.id);
      if (taken) return res.status(400).json({ message: "That email address is already in use." });
      await users.updateEmail(current.id, email);
      changedFields.push("Email address");
    }

    if (name.trim() !== current.name) changedFields.push("Full name");
    if ((phone || "") !== (current.phone || "")) changedFields.push("Phone number");
    if (avatar && avatar !== current.avatar) changedFields.push("Profile picture");

    const user = await users.update(current.id, {
      name: name.trim(),
      phone: phone || null,
      avatar: avatar || current.avatar,
    });

    // Merge email if it was changed
    const finalUser = email && email.toLowerCase() !== current.email
      ? { ...user, email: email.toLowerCase() }
      : user;

    if (changedFields.length) {
      sendProfileUpdated({ name: finalUser.name, email: finalUser.email, changedFields }).catch(() => {});
    }

    res.json({ user: finalUser });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword) return res.status(400).json({ message: "Current password is required." });
    if (!newPassword || newPassword.length < 8) return res.status(400).json({ message: "New password must be at least 8 characters." });
    if (!/[A-Z]/.test(newPassword)) return res.status(400).json({ message: "Password must contain at least one uppercase letter." });
    if (!/[a-z]/.test(newPassword)) return res.status(400).json({ message: "Password must contain at least one lowercase letter." });
    if (!/\d/.test(newPassword)) return res.status(400).json({ message: "Password must contain at least one number." });
    if (!/[^A-Za-z0-9]/.test(newPassword)) return res.status(400).json({ message: "Password must contain at least one special character." });

    const full = await users.findByEmail(req.user.email);
    const valid = await users.comparePassword(currentPassword, full.password);
    if (!valid) return res.status(400).json({ message: "Current password is incorrect." });

    const isSame = await bcrypt.compare(newPassword, full.password);
    if (isSame) return res.status(400).json({ message: "New password cannot be the same as your current password." });

    await users.updatePassword(req.user.id, newPassword);
    // Clear any outstanding reset tokens
    await users.setResetToken(req.user.id, null, null);

    sendPasswordChanged({ name: req.user.name, email: req.user.email }).catch(() => {});

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    next(err);
  }
}

// ── Addresses ────────────────────────────────────────────
async function getAddresses(req, res) {
  res.json({ addresses: req.user.addresses || [] });
}

async function addAddress(req, res, next) {
  try {
    const addresses = [...(req.user.addresses || [])];
    if (req.body.isDefault) addresses.forEach((a) => (a.isDefault = false));
    addresses.push({ ...req.body, id: Date.now() });
    const user = await users.updateAddresses(req.user.id, addresses);
    res.status(201).json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
}

async function updateAddress(req, res, next) {
  try {
    const addresses = (req.user.addresses || []).map((a) => {
      if (String(a.id) !== req.params.id) return a;
      if (req.body.isDefault) addresses.forEach((x) => (x.isDefault = false));
      return { ...a, ...req.body };
    });
    const user = await users.updateAddresses(req.user.id, addresses);
    res.json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const addresses = (req.user.addresses || []).filter((a) => String(a.id) !== req.params.id);
    const user = await users.updateAddresses(req.user.id, addresses);
    res.json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
}

// ── Wishlist ─────────────────────────────────────────────
async function getWishlist(req, res) {
  res.json({ wishlist: req.user.wishlist || [] });
}

async function addToWishlist(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const current = req.user.wishlist || [];
    if (current.includes(productId)) return res.json({ wishlist: current });
    const user = await users.updateWishlist(req.user.id, [...current, productId]);
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
}

async function removeFromWishlist(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const wishlist = (req.user.wishlist || []).filter((id) => id !== productId);
    const user = await users.updateWishlist(req.user.id, wishlist);
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
}

// ── Cart ─────────────────────────────────────────────────
async function getCart(req, res) {
  res.json({ cart: req.user.cart || [] });
}

async function updateCart(req, res, next) {
  try {
    const { items } = req.body; // [{ id, qty }]
    const user = await users.updateCart(req.user.id, items);
    res.json({ cart: user.cart });
  } catch (err) {
    next(err);
  }
}

// ── Delete account ────────────────────────────────────────
async function deleteAccount(req, res, next) {
  try {
    const { currentPassword } = req.body;
    const full = await users.findByEmail(req.user.email);
    const valid = await users.comparePassword(currentPassword, full.password);
    if (!valid) return res.status(400).json({ message: "Password is incorrect" });
    await pool.query("DELETE FROM users WHERE id=$1", [req.user.id]);
    res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
}

// ── Admin ─────────────────────────────────────────────────
async function getAllUsers(req, res, next) {
  try {
    const { page, limit, search } = req.query;
    const result = await users.findAll({ page, limit, search });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await users.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role))
      return res.status(400).json({ message: "Invalid role" });
    const user = await users.updateRole(req.params.id, role);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function disableUser(req, res, next) {
  try {
    const user = await users.disable(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User disabled", user });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile, updateProfile, changePassword,
  getAddresses, addAddress, updateAddress, deleteAddress,
  getWishlist, addToWishlist, removeFromWishlist,
  getCart, updateCart, deleteAccount,
  getAllUsers, getUserById, updateUserRole, disableUser,
  uploadAvatar, removeAvatar,
};
