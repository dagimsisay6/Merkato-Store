const users = require("../queries/users");
const bcrypt = require("bcryptjs");

// ── Profile ──────────────────────────────────────────────
async function getProfile(req, res) {
  res.json({ user: req.user });
}

async function updateProfile(req, res, next) {
  try {
    const { name, phone, avatar } = req.body;
    const user = await users.update(req.user.id, { name, phone, avatar });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const full = await users.findByEmail(req.user.email);
    const valid = await users.comparePassword(currentPassword, full.password);
    if (!valid) return res.status(400).json({ message: "Current password is incorrect" });
    await users.updatePassword(req.user.id, newPassword);
    res.json({ message: "Password updated" });
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
  getAllUsers, getUserById, updateUserRole, disableUser,
};
