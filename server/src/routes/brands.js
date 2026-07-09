const router = require("express").Router();
const Brand = require("../models/Brand");

router.get("/", async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true });
    res.json({ brands });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
