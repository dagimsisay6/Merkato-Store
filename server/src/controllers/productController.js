const products = require("../queries/products");

async function getProducts(req, res, next) {
  try {
    const { category, search, sort, featured, isNew, deals, exclude, page, limit } = req.query;
    const { products: rows, total } = await products.findAll({ category, search, sort, featured, isNew, deals, exclude, page, limit });
    const lim = Number(limit) || 20;
    res.json({ products: rows, total, page: Number(page) || 1, pages: Math.ceil(total / lim) });
  } catch (err) {
    next(err);
  }
}

async function getProductsByIds(req, res, next) {
  try {
    const ids = String(req.query.ids || "").split(",").map(Number).filter(Boolean);
    const rows = await products.findByIds(ids);
    res.json({ products: rows });
  } catch (err) {
    next(err);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const product = await products.findBySlug(req.params.slug);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await products.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await products.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await products.softDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProducts, getProductBySlug, getProductsByIds, createProduct, updateProduct, deleteProduct };
