const router = require("express").Router();
const { getCategories, getCategoryBySlug, createCategory } = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);
router.post("/", protect, adminOnly, createCategory);

module.exports = router;
