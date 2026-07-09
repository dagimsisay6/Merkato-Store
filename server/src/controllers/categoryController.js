const Category = require("../models/Category");

async function getCategories(req, res, next) {
  try {
    const categories = await Category.find({ isActive: true });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
}

async function getCategoryBySlug(req, res, next) {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ category });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories, getCategoryBySlug, createCategory };
