const Product = require("../models/Product");

async function getProducts(req, res, next) {
  try {
    const { category, search, sort, featured, isNew, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (req.query.exclude) filter._id = { $ne: req.query.exclude };
    if (featured) filter.isFeatured = true;
    if (isNew) filter.isNewArrival = true;
    if (req.query.deals) filter.originalPrice = { $exists: true, $gt: 0 };
    if (search) filter.$text = { $search: search };

    const sortMap = {
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortBy).skip(skip).limit(Number(limit)).populate("category", "name slug"),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Product removed" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct };
