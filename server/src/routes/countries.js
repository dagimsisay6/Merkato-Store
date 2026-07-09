const router = require("express").Router();
const Country = require("../models/Country");

router.get("/", async (req, res, next) => {
  try {
    const countries = await Country.find({ isActive: true });
    res.json({ countries });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
