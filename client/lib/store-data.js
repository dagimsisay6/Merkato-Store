const CDN = "https://res.cloudinary.com/wfpr1ryw/image/upload";
const v = {
  hero:         `${CDN}/v1783707230/merkato/hero.jpg`,
  appMockup:    `${CDN}/v1783707231/merkato/app-mockup.jpg`,
  pHeadphones:  `${CDN}/v1783707233/merkato/p-headphones.jpg`,
  pWatch:       `${CDN}/v1783707234/merkato/p-watch.jpg`,
  pSneakers:    `${CDN}/v1783707235/merkato/p-sneakers.jpg`,
  pBeauty:      `${CDN}/v1783707237/merkato/p-beauty.jpg`,
  pFashion:     `${CDN}/v1783707238/merkato/p-fashion.jpg`,
  pPhone:       `${CDN}/v1783707240/merkato/p-phones.jpg`,
};

export const CATEGORY_LIST = [
  { slug: "electronics", name: "Electronics", icon: "Smartphone", count: "12,400+", banner: "Latest tech, unbeatable prices." },
  { slug: "fashion", name: "Fashion", icon: "Shirt", count: "28,900+", banner: "Style from every corner of the region." },
  { slug: "beauty", name: "Beauty", icon: "Sparkles", count: "9,200+", banner: "Glow with the world's best beauty brands." },
  { slug: "accessories", name: "Accessories", icon: "Gem", count: "7,650+", banner: "Finish your look." },
];

const base = [
  {
    name: "Aurora Wireless Noise-Cancelling Headphones",
    brand: "Sonix", category: "Electronics", categorySlug: "electronics",
    price: 129.99, original: 199.99, rating: 4.8, reviews: 1284,
    img: v.pHeadphones, stock: 3,
    description: "40-hour battery, adaptive noise cancellation, plush memory-foam earcups. Travel-ready acoustics tuned by sound engineers in Lagos and Dubai.",
    features: ["Active noise cancellation", "40h battery life", "Bluetooth 5.3", "Foldable, travel case included"],
    tags: ["headphones", "audio", "wireless"], featured: true, isBestSeller: true,
  },
  {
    name: "Heritage Gold Automatic Wristwatch",
    brand: "Marakesh", category: "Accessories", categorySlug: "accessories",
    price: 249.0, original: 399.0, rating: 4.7, reviews: 642,
    img: v.pWatch, stock: 12,
    description: "A self-winding mechanical movement housed in 316L stainless steel with sapphire crystal — heritage craftsmanship for daily wear.",
    features: ["Automatic movement", "50m water resistant", "Sapphire crystal", "2-year warranty"],
    tags: ["watch", "luxury", "accessories"], featured: true, isBestSeller: true,
  },
  {
    name: "Emerald Runner Performance Sneakers",
    brand: "Pace", category: "Fashion", categorySlug: "fashion",
    price: 89.5, original: 130.0, rating: 4.6, reviews: 2310,
    img: v.pSneakers, stock: 20,
    description: "Lightweight knit upper, responsive foam midsole — built for the streets of Nairobi to the boardwalks of Dubai.",
    features: ["Breathable knit upper", "Responsive cushioning", "Recycled materials", "Unisex sizing"],
    tags: ["sneakers", "running", "shoes"], isNew: true,
  },
  {
    name: "Pure Glow Vitamin C Brightening Serum",
    brand: "Lumière", category: "Beauty", categorySlug: "beauty",
    price: 34.0, original: 49.0, rating: 4.9, reviews: 4120,
    img: v.pBeauty, stock: 50,
    description: "20% pure vitamin C, hyaluronic acid and ferulic acid. Brightens, hydrates, and protects in a single drop.",
    features: ["20% Vitamin C", "Dermatologist tested", "Cruelty free", "30ml glass dropper"],
    tags: ["serum", "skincare", "vitamin c"], isNew: true, isBestSeller: true,
  },
  {
    name: "Royal Ankara Print Wax Fabric — 6 yards",
    brand: "Lagos Loom", category: "Fashion", categorySlug: "fashion",
    price: 59.0, original: 79.0, rating: 4.8, reviews: 880,
    img: v.pFashion, stock: 8,
    description: "Authentic Ankara wax print, hand-finished in Lagos. Bold colour, soft drape, premium 100% cotton.",
    features: ["100% premium cotton", "6 yards length", "Handcrafted in Nigeria", "Fade-resistant dyes"],
    tags: ["fabric", "ankara", "textile"], isNew: true,
  },
  {
    name: "Nova X12 Pro Smartphone 256GB",
    brand: "Nova", category: "Electronics", categorySlug: "electronics",
    price: 549.0, original: 699.0, rating: 4.7, reviews: 1860,
    img: v.pPhone, stock: 5,
    description: "6.7\" AMOLED, triple 108MP camera, 5000mAh battery and 90W fast charging — flagship power at a fair price.",
    features: ["6.7\" AMOLED 120Hz", "108MP triple camera", "5000mAh + 90W charge", "Dual SIM 5G"],
    tags: ["smartphone", "android", "5g"], featured: true, isBestSeller: true,
  },
];

// Expand to 24 products by rotating
export const PRODUCTS = Array.from({ length: 24 }, (_, i) => {
  const b = base[i % base.length];
  const variant = Math.floor(i / base.length);
  const suffix = variant === 0 ? "" : ` · Edition ${variant + 1}`;
  const baseName = b.name + suffix;
  return {
    ...b,
    id: String(i + 1),
    slug: `${baseName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    name: baseName,
    price: +(b.price * (1 + variant * 0.05)).toFixed(2),
    original: b.original ? +(b.original * (1 + variant * 0.05)).toFixed(2) : undefined,
    reviews: b.reviews - variant * 100,
    // images array — ready to swap with real URLs
    images: [b.img, b.img, b.img, b.img],
    // carry forward flags only for base variants
    featured: variant === 0 ? b.featured : false,
    isNew: variant === 0 ? b.isNew : false,
    isBestSeller: variant === 0 ? b.isBestSeller : false,
    // keep lowStock alias for backward compat
    lowStock: b.stock <= 5 ? b.stock : undefined,
  };
});

export const COUNTRIES = [
  { code: "NG", name: "Nigeria", flag: "🇳🇬", capital: "Lagos", currency: "NGN" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", capital: "Nairobi", currency: "KES" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", capital: "Addis Ababa", currency: "ETB" },
  { code: "AE", name: "UAE", flag: "🇦🇪", capital: "Dubai", currency: "AED" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", capital: "Cairo", currency: "EGP" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", capital: "Riyadh", currency: "SAR" },
];

export const BRANDS = [
  { slug: "nova", name: "Nova", desc: "Premium consumer electronics.", count: 84 },
  { slug: "marakesh", name: "Marakesh", desc: "Heritage timepieces & leather.", count: 32 },
  { slug: "lumiere", name: "Lumière", desc: "Clean, effective skincare.", count: 56 },
  { slug: "sonix", name: "Sonix", desc: "High-fidelity audio for everyone.", count: 41 },
  { slug: "pace", name: "Pace", desc: "Performance sportswear.", count: 67 },
  { slug: "lagos-loom", name: "Lagos Loom", desc: "Handcrafted African textiles.", count: 28 },
  { slug: "sahara", name: "Sahara", desc: "Desert-inspired home & decor.", count: 39 },
  { slug: "kilimanjaro", name: "Kilimanjaro", desc: "Outdoor & adventure gear.", count: 22 },
];

export const TRENDING_SEARCHES = ["wireless headphones", "ankara fabric", "vitamin c serum", "running shoes", "smart watch", "air fryer", "perfume", "ramadan deals"];

export const fmt = (n) => `$${n.toFixed(2)}`;
export const imgSrc = (img) => img?.src ?? img ?? "";

export const findProduct = (id) => PRODUCTS.find(p => p.id === id);
export const findProductBySlug = (slug) => PRODUCTS.find(p => p.slug === slug) ?? PRODUCTS.find(p => p.id === slug);
export const findCategory = (slug) => CATEGORY_LIST.find(c => c.slug === slug);
export const productsByCategory = (slug) => PRODUCTS.filter(p => p.categorySlug === slug);
export const featuredProducts = () => PRODUCTS.filter(p => p.featured);
export const newArrivals = () => PRODUCTS.filter(p => p.isNew);
export const bestSellers = () => [...PRODUCTS].sort((a, b) => b.reviews - a.reviews);
export const dealProducts = () => PRODUCTS.filter(p => p.original && p.original > p.price);
export const relatedProducts = (product, limit = 4) =>
  PRODUCTS.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, limit);

export const MOCK_ORDERS = [
  { id: "MK-10248", date: "2026-06-02", status: "Delivered", total: 263.49, items: 2, tracking: "DLV-29381" },
  { id: "MK-10231", date: "2026-05-21", status: "In transit", total: 89.5, items: 1, tracking: "DLV-29142" },
  { id: "MK-10199", date: "2026-05-04", status: "Processing", total: 549.0, items: 1, tracking: "DLV-28977" },
  { id: "MK-10145", date: "2026-04-18", status: "Delivered", total: 122.0, items: 3, tracking: "DLV-28722" },
];

export const MOCK_ADDRESSES = [
  { id: "a1", label: "Home", name: "Amara Okafor", line1: "12 Marina Boulevard", city: "Lagos", country: "Nigeria", phone: "+234 801 234 5678", default: true },
  { id: "a2", label: "Office", name: "Amara Okafor", line1: "Tower 7, Sheikh Zayed Rd.", city: "Dubai", country: "UAE", phone: "+971 50 123 4567", default: false },
];

export const MOCK_REVIEWS = [
  { id: "r1", product: "Aurora Wireless Headphones", rating: 5, date: "2026-06-01", text: "Sound is gorgeous and the noise-cancellation is unreal on flights." },
  { id: "r2", product: "Emerald Runner Sneakers", rating: 4, date: "2026-05-20", text: "Super comfortable. Sizing runs slightly small." },
];
