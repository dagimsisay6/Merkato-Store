const pool = require("../config/db");

async function findAll() {
  const { rows } = await pool.query("SELECT * FROM brands WHERE is_active = TRUE ORDER BY name");
  return rows;
}

async function create({ name, slug, description, logo, count }) {
  const { rows } = await pool.query(
    "INSERT INTO brands (name, slug, description, logo, count) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [name, slug, description, logo, count]
  );
  return rows[0];
}

module.exports = { findAll, create };
