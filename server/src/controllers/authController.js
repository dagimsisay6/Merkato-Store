const jwt = require("jsonwebtoken");
const users = require("../queries/users");

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

module.exports = { signup, signin, getMe };
