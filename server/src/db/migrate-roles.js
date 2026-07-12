/**
 * Migration: update role column to support 'customer' role
 * Run once: node src/db/migrate-roles.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const pool = require("../config/db");

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Step 1: Drop old constraint
    await client.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check`);

    // Step 2: Rename existing 'user' role values to 'customer'
    const { rowCount } = await client.query(
      "UPDATE users SET role = 'customer' WHERE role = 'user'"
    );

    // Step 3: Add new constraint and update default
    await client.query(`
      ALTER TABLE users
        ALTER COLUMN role SET DEFAULT 'customer',
        ADD CONSTRAINT users_role_check CHECK (role IN ('customer', 'admin', 'disabled'))
    `);

    await client.query("COMMIT");
    console.log(`✅ Migration complete. ${rowCount} user(s) updated to 'customer' role.`);
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
