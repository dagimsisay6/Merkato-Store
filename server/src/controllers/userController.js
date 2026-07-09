const User = require("../models/User");

async function getProfile(req, res) {
  res.json({ user: req.user });
}

async function updateProfile(req, res, next) {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true, runValidators: true });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function getAddresses(req, res) {
  res.json({ addresses: req.user.addresses });
}

async function addAddress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, getAddresses, addAddress, deleteAddress };
