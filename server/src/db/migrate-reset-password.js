require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const { Client } = require("pg");

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  await client.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS reset_password_token   TEXT,
      ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMPTZ;
  `);
  console.log("✅ reset_password columns added");
  await client.end();
}

run().catch((err) => { console.error("❌", err.message); process.exit(1); });
