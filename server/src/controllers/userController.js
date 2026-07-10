const users = require("../queries/users");

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

async function deleteAddress(req, res, next) {
  try {
    const addresses = (req.user.addresses || []).filter((a) => String(a.id) !== req.params.id);
    const user = await users.updateAddresses(req.user.id, addresses);
    res.json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, getAddresses, addAddress, deleteAddress };
