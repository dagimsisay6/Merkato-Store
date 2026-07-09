const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    features: [{ type: String }],
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", brand: "text", tags: "text" });
productSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("Product", productSchema);
