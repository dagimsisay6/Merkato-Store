require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const Category = require("./src/models/Category");
const Product = require("./src/models/Product");
const Brand = require("./src/models/Brand");
const Country = require("./src/models/Country");

// ─── Categories ──────────────────────────────────────────────────────────────
const categories = [
  { name: "Electronics", slug: "electronics", icon: "Smartphone", banner: "Latest tech, unbeatable prices." },
  { name: "Fashion", slug: "fashion", icon: "Shirt", banner: "Style from every corner of the region." },
  { name: "Beauty", slug: "beauty", icon: "Sparkles", banner: "Glow with the world's best beauty brands." },
  { name: "Accessories", slug: "accessories", icon: "Gem", banner: "Finish your look." },
];

// ─── Brands ──────────────────────────────────────────────────────────────────
const brands = [
  { slug: "nova", name: "Nova", desc: "Premium consumer electronics.", count: 84 },
  { slug: "marakesh", name: "Marakesh", desc: "Heritage timepieces & leather.", count: 32 },
  { slug: "lumiere", name: "Lumière", desc: "Clean, effective skincare.", count: 56 },
  { slug: "sonix", name: "Sonix", desc: "High-fidelity audio for everyone.", count: 41 },
  { slug: "pace", name: "Pace", desc: "Performance sportswear.", count: 67 },
  { slug: "lagos-loom", name: "Lagos Loom", desc: "Handcrafted African textiles.", count: 28 },
  { slug: "sahara", name: "Sahara", desc: "Desert-inspired home & decor.", count: 39 },
  { slug: "kilimanjaro", name: "Kilimanjaro", desc: "Outdoor & adventure gear.", count: 22 },
];

// ─── Countries ───────────────────────────────────────────────────────────────
const countries = [
  { code: "NG", name: "Nigeria", flag: "🇳🇬", capital: "Lagos", currency: "NGN" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", capital: "Nairobi", currency: "KES" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", capital: "Addis Ababa", currency: "ETB" },
  { code: "AE", name: "UAE", flag: "🇦🇪", capital: "Dubai", currency: "AED" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", capital: "Cairo", currency: "EGP" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", capital: "Riyadh", currency: "SAR" },
];

// ─── Base products ───────────────────────────────────────────────────────────
const base = [
  {
    name: "Aurora Wireless Noise-Cancelling Headphones",
    brand: "Sonix", categorySlug: "electronics",
    price: 129.99, originalPrice: 199.99, rating: 4.8, reviewCount: 1284, stock: 3,
    description: "40-hour battery, adaptive noise cancellation, plush memory-foam earcups. Travel-ready acoustics tuned by sound engineers in Lagos and Dubai.",
    features: ["Active noise cancellation", "40h battery life", "Bluetooth 5.3", "Foldable, travel case included"],
    tags: ["headphones", "audio", "wireless"],
    images: ["/images/p-headphones.jpg"],
    isFeatured: true, isBestSeller: true,
  },
  {
    name: "Heritage Gold Automatic Wristwatch",
    brand: "Marakesh", categorySlug: "accessories",
    price: 249.00, originalPrice: 399.00, rating: 4.7, reviewCount: 642, stock: 12,
    description: "A self-winding mechanical movement housed in 316L stainless steel with sapphire crystal — heritage craftsmanship for daily wear.",
    features: ["Automatic movement", "50m water resistant", "Sapphire crystal", "2-year warranty"],
    tags: ["watch", "luxury", "accessories"],
    images: ["/images/p-watch.jpg"],
    isFeatured: true, isBestSeller: true,
  },
  {
    name: "Emerald Runner Performance Sneakers",
    brand: "Pace", categorySlug: "fashion",
    price: 89.50, originalPrice: 130.00, rating: 4.6, reviewCount: 2310, stock: 20,
    description: "Lightweight knit upper, responsive foam midsole — built for the streets of Nairobi to the boardwalks of Dubai.",
    features: ["Breathable knit upper", "Responsive cushioning", "Recycled materials", "Unisex sizing"],
    tags: ["sneakers", "running", "shoes"],
    images: ["/images/p-sneakers.jpg"],
    isNewArrival: true,
  },
  {
    name: "Pure Glow Vitamin C Brightening Serum",
    brand: "Lumière", categorySlug: "beauty",
    price: 34.00, originalPrice: 49.00, rating: 4.9, reviewCount: 4120, stock: 50,
    description: "20% pure vitamin C, hyaluronic acid and ferulic acid. Brightens, hydrates, and protects in a single drop.",
    features: ["20% Vitamin C", "Dermatologist tested", "Cruelty free", "30ml glass dropper"],
    tags: ["serum", "skincare", "vitamin c"],
    images: ["/images/p-beauty.jpg"],
    isNewArrival: true, isBestSeller: true,
  },
  {
    name: "Royal Ankara Print Wax Fabric — 6 yards",
    brand: "Lagos Loom", categorySlug: "fashion",
    price: 59.00, originalPrice: 79.00, rating: 4.8, reviewCount: 880, stock: 8,
    description: "Authentic Ankara wax print, hand-finished in Lagos. Bold colour, soft drape, premium 100% cotton.",
    features: ["100% premium cotton", "6 yards length", "Handcrafted in Nigeria", "Fade-resistant dyes"],
    tags: ["fabric", "ankara", "textile"],
    images: ["/images/p-fashion.jpg"],
    isNewArrival: true,
  },
  {
    name: "Nova X12 Pro Smartphone 256GB",
    brand: "Nova", categorySlug: "electronics",
    price: 549.00, originalPrice: 699.00, rating: 4.7, reviewCount: 1860, stock: 5,
    description: "6.7\" AMOLED, triple 108MP camera, 5000mAh battery and 90W fast charging — flagship power at a fair price.",
    features: ["6.7\" AMOLED 120Hz", "108MP triple camera", "5000mAh + 90W charge", "Dual SIM 5G"],
    tags: ["smartphone", "android", "5g"],
    images: ["/images/p-phones.jpg"],
    isFeatured: true, isBestSeller: true,
  },
];

// ─── Expand to 24 products (matching frontend logic) ─────────────────────────
function buildProducts(categoryMap) {
  return Array.from({ length: 24 }, (_, i) => {
    const b = base[i % base.length];
    const variant = Math.floor(i / base.length);
    const suffix = variant === 0 ? "" : ` · Edition ${variant + 1}`;
    const name = b.name + suffix;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return {
      name,
      slug,
      brand: b.brand,
      category: categoryMap[b.categorySlug],
      price: +(b.price * (1 + variant * 0.05)).toFixed(2),
      originalPrice: b.originalPrice ? +(b.originalPrice * (1 + variant * 0.05)).toFixed(2) : undefined,
      rating: b.rating,
      reviewCount: b.reviewCount - variant * 100,
      stock: b.stock,
      description: b.description,
      features: b.features,
      tags: b.tags,
      images: b.images,
      isFeatured: variant === 0 ? !!b.isFeatured : false,
      isNewArrival: variant === 0 ? !!b.isNewArrival : false,
      isBestSeller: variant === 0 ? !!b.isBestSeller : false,
      isActive: true,
    };
  });
}

// ─── Run seed ─────────────────────────────────────────────────────────────────
async function seed() {
  await connectDB();

  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    Brand.deleteMany({}),
    Country.deleteMany({}),
  ]);
  console.log("🗑️  Cleared existing data");

  const createdCategories = await Category.insertMany(categories);
  console.log(`✅ Seeded ${createdCategories.length} categories`);

  const categoryMap = {};
  createdCategories.forEach((c) => (categoryMap[c.slug] = c._id));

  const createdProducts = await Product.insertMany(buildProducts(categoryMap));
  console.log(`✅ Seeded ${createdProducts.length} products`);

  const createdBrands = await Brand.insertMany(brands);
  console.log(`✅ Seeded ${createdBrands.length} brands`);

  const createdCountries = await Country.insertMany(countries);
  console.log(`✅ Seeded ${createdCountries.length} countries`);

  console.log("🌱 Database seeded successfully!");
  mongoose.connection.close();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  mongoose.connection.close();
  process.exit(1);
});
