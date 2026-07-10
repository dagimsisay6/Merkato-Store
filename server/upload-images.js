require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ASSETS_DIR = path.join(__dirname, "../client/assets");

const images = [
  { file: "hero.jpg",          public_id: "merkato/hero" },
  { file: "app-mockup.jpg",    public_id: "merkato/app-mockup" },
  { file: "p-headphones.jpg",  public_id: "merkato/p-headphones" },
  { file: "p-watch.jpg",       public_id: "merkato/p-watch" },
  { file: "p-sneakers.jpg",    public_id: "merkato/p-sneakers" },
  { file: "p-beauty.jpg",      public_id: "merkato/p-beauty" },
  { file: "p-fashion.jpg",     public_id: "merkato/p-fashion" },
  { file: "p-phones.jpg",      public_id: "merkato/p-phones" },
];

async function upload() {
  console.log("☁️  Uploading images to Cloudinary...\n");
  const results = {};

  for (const img of images) {
    const filePath = path.join(ASSETS_DIR, img.file);
    const res = await cloudinary.uploader.upload(filePath, {
      public_id: img.public_id,
      overwrite: true,
      resource_type: "image",
    });
    results[img.file] = res.secure_url;
    console.log(`✅ ${img.file} → ${res.secure_url}`);
  }

  console.log("\n📋 Copy these URLs into seed.js:\n");
  console.log(JSON.stringify(results, null, 2));
}

upload().catch((err) => {
  console.error("❌ Upload failed:", err.message);
  process.exit(1);
});
