require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

  await client.connect();
  console.log("✅ Connected to Neon");

  await client.query(sql);
  console.log("✅ Schema applied successfully");

  await client.end();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
