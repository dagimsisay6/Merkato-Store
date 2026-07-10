const categories = require("../queries/categories");

async function getCategories(req, res, next) {
  try {
    const rows = await categories.findAll();
    res.json({ categories: rows });
  } catch (err) {
    next(err);
  }
}

async function getCategoryBySlug(req, res, next) {
  try {
    const category = await categories.findBySlug(req.params.slug);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ category });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await categories.create(req.body);
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories, getCategoryBySlug, createCategory };
