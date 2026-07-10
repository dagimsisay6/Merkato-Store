const router = require("express").Router();
const brands = require("../queries/brands");

router.get("/", async (req, res, next) => {
  try {
    const rows = await brands.findAll();
    res.json({ brands: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
