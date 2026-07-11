const products = require("../queries/products");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

async function uploadImage(req, res, next) {
  try {
    const { data, filename } = req.body; // data: base64 string, filename: original name
    if (!data) return res.status(400).json({ message: "No image data provided" });
    const public_id = `merkato/products/${Date.now()}-${(filename || "img").replace(/[^a-z0-9]/gi, "-")}`;
    const result = await cloudinary.uploader.upload(data, {
      public_id,
      overwrite: false,
      resource_type: "image",
    });
    res.json({ url: result.secure_url });
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

module.exports = { getProducts, getProductBySlug, getProductsByIds, uploadImage, createProduct, updateProduct, deleteProduct };
