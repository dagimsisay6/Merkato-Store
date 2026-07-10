require("dotenv").config();
const { Client } = require("pg");

const connStr = process.env.DATABASE_URL;

const categories = [
  { name: "Electronics", slug: "electronics", icon: "Smartphone", banner: "Latest tech, unbeatable prices." },
  { name: "Fashion", slug: "fashion", icon: "Shirt", banner: "Style from every corner of the region." },
  { name: "Beauty", slug: "beauty", icon: "Sparkles", banner: "Glow with the world's best beauty brands." },
  { name: "Accessories", slug: "accessories", icon: "Gem", banner: "Finish your look." },
];

const brands = [
  { slug: "nova", name: "Nova", description: "Premium consumer electronics.", count: 84 },
  { slug: "marakesh", name: "Marakesh", description: "Heritage timepieces & leather.", count: 32 },
  { slug: "lumiere", name: "Lumière", description: "Clean, effective skincare.", count: 56 },
  { slug: "sonix", name: "Sonix", description: "High-fidelity audio for everyone.", count: 41 },
  { slug: "pace", name: "Pace", description: "Performance sportswear.", count: 67 },
  { slug: "lagos-loom", name: "Lagos Loom", description: "Handcrafted African textiles.", count: 28 },
  { slug: "sahara", name: "Sahara", description: "Desert-inspired home & decor.", count: 39 },
  { slug: "kilimanjaro", name: "Kilimanjaro", description: "Outdoor & adventure gear.", count: 22 },
];

const countries = [
  { code: "NG", name: "Nigeria", flag: "🇳🇬", capital: "Lagos", currency: "NGN" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", capital: "Nairobi", currency: "KES" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", capital: "Addis Ababa", currency: "ETB" },
  { code: "AE", name: "UAE", flag: "🇦🇪", capital: "Dubai", currency: "AED" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", capital: "Cairo", currency: "EGP" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", capital: "Riyadh", currency: "SAR" },
];

const base = [
  { name: "Aurora Wireless Noise-Cancelling Headphones", brand: "Sonix", categorySlug: "electronics", price: 129.99, originalPrice: 199.99, rating: 4.8, reviewCount: 1284, stock: 3, description: "40-hour battery, adaptive noise cancellation, plush memory-foam earcups.", features: ["Active noise cancellation", "40h battery life", "Bluetooth 5.3", "Foldable, travel case included"], tags: ["headphones", "audio", "wireless"], images: ["/images/p-headphones.jpg"], isFeatured: true, isBestSeller: true },
  { name: "Heritage Gold Automatic Wristwatch", brand: "Marakesh", categorySlug: "accessories", price: 249.00, originalPrice: 399.00, rating: 4.7, reviewCount: 642, stock: 12, description: "A self-winding mechanical movement housed in 316L stainless steel.", features: ["Automatic movement", "50m water resistant", "Sapphire crystal", "2-year warranty"], tags: ["watch", "luxury", "accessories"], images: ["/images/p-watch.jpg"], isFeatured: true, isBestSeller: true },
  { name: "Emerald Runner Performance Sneakers", brand: "Pace", categorySlug: "fashion", price: 89.50, originalPrice: 130.00, rating: 4.6, reviewCount: 2310, stock: 20, description: "Lightweight knit upper, responsive foam midsole.", features: ["Breathable knit upper", "Responsive cushioning", "Recycled materials", "Unisex sizing"], tags: ["sneakers", "running", "shoes"], images: ["/images/p-sneakers.jpg"], isNewArrival: true },
  { name: "Pure Glow Vitamin C Brightening Serum", brand: "Lumière", categorySlug: "beauty", price: 34.00, originalPrice: 49.00, rating: 4.9, reviewCount: 4120, stock: 50, description: "20% pure vitamin C, hyaluronic acid and ferulic acid.", features: ["20% Vitamin C", "Dermatologist tested", "Cruelty free", "30ml glass dropper"], tags: ["serum", "skincare", "vitamin c"], images: ["/images/p-beauty.jpg"], isNewArrival: true, isBestSeller: true },
  { name: "Royal Ankara Print Wax Fabric — 6 yards", brand: "Lagos Loom", categorySlug: "fashion", price: 59.00, originalPrice: 79.00, rating: 4.8, reviewCount: 880, stock: 8, description: "Authentic Ankara wax print, hand-finished in Lagos.", features: ["100% premium cotton", "6 yards length", "Handcrafted in Nigeria", "Fade-resistant dyes"], tags: ["fabric", "ankara", "textile"], images: ["/images/p-fashion.jpg"], isNewArrival: true },
  { name: "Nova X12 Pro Smartphone 256GB", brand: "Nova", categorySlug: "electronics", price: 549.00, originalPrice: 699.00, rating: 4.7, reviewCount: 1860, stock: 5, description: "6.7\" AMOLED, triple 108MP camera, 5000mAh battery.", features: ["6.7\" AMOLED 120Hz", "108MP triple camera", "5000mAh + 90W charge", "Dual SIM 5G"], tags: ["smartphone", "android", "5g"], images: ["/images/p-phones.jpg"], isFeatured: true, isBestSeller: true },
];

async function seed() {
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("✅ Connected to Neon");

  // Clear tables in dependency order
  await client.query("TRUNCATE orders, reviews, products, categories, brands, countries RESTART IDENTITY CASCADE");
  console.log("🗑️  Cleared existing data");

  // Seed categories
  for (const c of categories) {
    await client.query(
      "INSERT INTO categories (name, slug, icon, banner) VALUES ($1,$2,$3,$4) ON CONFLICT (slug) DO NOTHING",
      [c.name, c.slug, c.icon, c.banner]
    );
  }
  console.log(`✅ Seeded ${categories.length} categories`);

  // Seed brands
  for (const b of brands) {
    await client.query(
      "INSERT INTO brands (name, slug, description, count) VALUES ($1,$2,$3,$4) ON CONFLICT (slug) DO NOTHING",
      [b.name, b.slug, b.description, b.count]
    );
  }
  console.log(`✅ Seeded ${brands.length} brands`);

  // Seed countries
  for (const c of countries) {
    await client.query(
      "INSERT INTO countries (code, name, flag, capital, currency) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (code) DO NOTHING",
      [c.code, c.name, c.flag, c.capital, c.currency]
    );
  }
  console.log(`✅ Seeded ${countries.length} countries`);

  // Get category id map
  const { rows: catRows } = await client.query("SELECT id, slug FROM categories");
  const catMap = Object.fromEntries(catRows.map((r) => [r.slug, r.id]));

  // Seed 24 products
  const products = Array.from({ length: 24 }, (_, i) => {
    const b = base[i % base.length];
    const variant = Math.floor(i / base.length);
    const suffix = variant === 0 ? "" : ` · Edition ${variant + 1}`;
    const name = b.name + suffix;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return {
      name, slug, brand: b.brand,
      category_id: catMap[b.categorySlug],
      price: +(b.price * (1 + variant * 0.05)).toFixed(2),
      original_price: b.originalPrice ? +(b.originalPrice * (1 + variant * 0.05)).toFixed(2) : null,
      rating: b.rating,
      review_count: b.reviewCount - variant * 100,
      stock: b.stock,
      description: b.description,
      features: b.features,
      tags: b.tags,
      images: b.images,
      is_featured: variant === 0 ? !!b.isFeatured : false,
      is_new_arrival: variant === 0 ? !!b.isNewArrival : false,
      is_best_seller: variant === 0 ? !!b.isBestSeller : false,
    };
  });

  for (const p of products) {
    await client.query(
      `INSERT INTO products (name,slug,brand,description,price,original_price,images,category_id,stock,rating,review_count,features,tags,is_featured,is_new_arrival,is_best_seller)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) ON CONFLICT (slug) DO NOTHING`,
      [p.name, p.slug, p.brand, p.description, p.price, p.original_price, p.images, p.category_id, p.stock, p.rating, p.review_count, p.features, p.tags, p.is_featured, p.is_new_arrival, p.is_best_seller]
    );
  }
  console.log(`✅ Seeded ${products.length} products`);

  console.log("🌱 Database seeded successfully!");
  await client.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
