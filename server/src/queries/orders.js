const pool = require("../config/db");

async function findAll({ page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const { rows } = await pool.query(
    `SELECT o.*, u.name AS user_name, u.email AS user_email
     FROM orders o LEFT JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`,
    [Number(limit), offset]
  );
  return rows;
}

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

async function updateStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [status, id]
  );
  return rows[0] || null;
}

module.exports = { findAll, findByUser, findById, updateStatus, create };
