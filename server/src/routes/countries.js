const router = require("express").Router();
const countries = require("../queries/countries");

router.get("/", async (req, res, next) => {
  try {
    const rows = await countries.findAll();
    res.json({ countries: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
