/**
 * Migration: add email OTP verification columns to users
 * Run once: node src/db/migrate-otp.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const pool = require("../config/db");

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS is_verified     BOOLEAN     NOT NULL DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS otp_hash        TEXT,
        ADD COLUMN IF NOT EXISTS otp_expires     TIMESTAMPTZ
    `);
    await client.query("COMMIT");
    console.log("✅ OTP migration complete.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
