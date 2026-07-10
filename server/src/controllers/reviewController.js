const reviews = require("../queries/reviews");
const products = require("../queries/products");

async function getProductReviews(req, res, next) {
  try {
    const product = await products.findBySlug(req.params.slug);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const rows = await reviews.findByProduct(product.id);
    res.json({ reviews: rows });
  } catch (err) {
    next(err);
  }
}

async function getUserReviews(req, res, next) {
  try {
    const rows = await reviews.findByUser(req.user.id);
    res.json({ reviews: rows });
  } catch (err) {
    next(err);
  }
}

async function createReview(req, res, next) {
  try {
    const product = await products.findBySlug(req.params.slug);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const { rating, text } = req.body;
    const review = await reviews.create({ user_id: req.user.id, product_id: product.id, rating, text });
    res.status(201).json({ review });
  } catch (err) {
    if (err.code === "23505") return res.status(400).json({ message: "You already reviewed this product" });
    next(err);
  }
}

async function deleteReview(req, res, next) {
  try {
    await reviews.remove(req.params.id, req.user.id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProductReviews, getUserReviews, createReview, deleteReview };
