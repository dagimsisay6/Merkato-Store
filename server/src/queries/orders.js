const pool = require("../config/db");

async function findByUser(userId) {
  const { rows } = await pool.query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

async function findById(id, userId) {
  const { rows } = await pool.query(
    "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
  return rows[0] || null;
}

async function create({ user_id, items, shipping_address, payment_method, subtotal, shipping_fee, total }) {
  const { rows } = await pool.query(
    `INSERT INTO orders (user_id, items, shipping_address, payment_method, subtotal, shipping_fee, total)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [user_id, JSON.stringify(items), JSON.stringify(shipping_address), payment_method, subtotal, shipping_fee, total]
  );
  return rows[0];
}

module.exports = { findByUser, findById, create };
