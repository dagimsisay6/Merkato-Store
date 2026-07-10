const pool = require("../config/db");

async function findAll() {
  const { rows } = await pool.query("SELECT * FROM categories WHERE is_active = TRUE ORDER BY name");
  return rows;
}

async function findBySlug(slug) {
  const { rows } = await pool.query("SELECT * FROM categories WHERE slug = $1 AND is_active = TRUE", [slug]);
  return rows[0] || null;
}

async function create({ name, slug, icon, banner }) {
  const { rows } = await pool.query(
    "INSERT INTO categories (name, slug, icon, banner) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, slug, icon, banner]
  );
  return rows[0];
}

module.exports = { findAll, findBySlug, create };
