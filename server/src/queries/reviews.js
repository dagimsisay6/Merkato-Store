const pool = require("../config/db");

async function findByProduct(productId) {
  const { rows } = await pool.query(
    `SELECT r.*, u.name AS user_name, u.avatar AS user_avatar
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC`,
    [productId]
  );
  return rows;
}

async function findByUser(userId) {
  const { rows } = await pool.query(
    `SELECT r.*, p.name AS product_name, p.slug AS product_slug, p.images AS product_images
     FROM reviews r
     JOIN products p ON p.id = r.product_id
     WHERE r.user_id = $1
     ORDER BY r.created_at DESC`,
    [userId]
  );
  return rows;
}

async function create({ user_id, product_id, rating, text }) {
  const { rows } = await pool.query(
    `INSERT INTO reviews (user_id, product_id, rating, text)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [user_id, product_id, rating, text]
  );
  await updateProductRating(product_id);
  return rows[0];
}

async function remove(id, userId) {
  await pool.query("DELETE FROM reviews WHERE id=$1 AND user_id=$2", [id, userId]);
  // get product_id to update rating
  const { rows } = await pool.query("SELECT product_id FROM reviews WHERE id=$1", [id]);
  if (rows[0]) await updateProductRating(rows[0].product_id);
}

async function updateProductRating(productId) {
  await pool.query(
    `UPDATE products
     SET rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE product_id = $1),
         review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = $1),
         updated_at = NOW()
     WHERE id = $1`,
    [productId]
  );
}

module.exports = { findByProduct, findByUser, create, remove };
