const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const PUBLIC_FIELDS = "id, name, email, role, avatar, phone, addresses, wishlist, cart, created_at";

async function findByEmail(email) {
  const { rows } = await pool.query("SELECT *, password FROM users WHERE email = $1", [email.toLowerCase()]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function findAll({ page = 1, limit = 20, search } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const params = [];
  let where = "";
  if (search) {
    params.push(`%${search}%`);
    where = `WHERE name ILIKE $1 OR email ILIKE $1`;
  }
  params.push(Number(limit), offset);
  const [data, count] = await Promise.all([
    pool.query(`SELECT ${PUBLIC_FIELDS} FROM users ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`, params),
    pool.query(`SELECT COUNT(*) FROM users ${where}`, params.slice(0, -2)),
  ]);
  return { users: data.rows, total: Number(count.rows[0].count) };
}

async function create({ name, email, password }) {
  const hash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role",
    [name, email.toLowerCase(), hash]
  );
  return rows[0];
}

async function update(id, { name, phone, avatar }) {
  const { rows } = await pool.query(
    `UPDATE users SET name=$1, phone=$2, avatar=$3, updated_at=NOW() WHERE id=$4 RETURNING ${PUBLIC_FIELDS}`,
    [name, phone, avatar, id]
  );
  return rows[0];
}

async function updateRole(id, role) {
  const { rows } = await pool.query(
    `UPDATE users SET role=$1, updated_at=NOW() WHERE id=$2 RETURNING ${PUBLIC_FIELDS}`,
    [role, id]
  );
  return rows[0] || null;
}

async function updatePassword(id, password) {
  const hash = await bcrypt.hash(password, 12);
  await pool.query("UPDATE users SET password=$1, updated_at=NOW() WHERE id=$2", [hash, id]);
}

async function disable(id) {
  const { rows } = await pool.query(
    `UPDATE users SET role='disabled', updated_at=NOW() WHERE id=$1 RETURNING ${PUBLIC_FIELDS}`,
    [id]
  );
  return rows[0] || null;
}

async function updateAddresses(id, addresses) {
  const { rows } = await pool.query(
    `UPDATE users SET addresses=$1, updated_at=NOW() WHERE id=$2 RETURNING ${PUBLIC_FIELDS}`,
    [JSON.stringify(addresses), id]
  );
  return rows[0];
}

async function updateWishlist(id, wishlist) {
  const { rows } = await pool.query(
    `UPDATE users SET wishlist=$1, updated_at=NOW() WHERE id=$2 RETURNING ${PUBLIC_FIELDS}`,
    [wishlist, id]
  );
  return rows[0];
}

async function updateCart(id, cart) {
  const { rows } = await pool.query(
    `UPDATE users SET cart=$1, updated_at=NOW() WHERE id=$2 RETURNING ${PUBLIC_FIELDS}`,
    [JSON.stringify(cart), id]
  );
  return rows[0];
}

function comparePassword(candidate, hash) {
  return bcrypt.compare(candidate, hash);
}

async function setResetToken(id, tokenHash, expires) {
  await pool.query(
    "UPDATE users SET reset_password_token=$1, reset_password_expires=$2, updated_at=NOW() WHERE id=$3",
    [tokenHash, expires, id]
  );
}

async function findByResetToken(tokenHash) {
  const { rows } = await pool.query(
    "SELECT id, email, password FROM users WHERE reset_password_token=$1 AND reset_password_expires > NOW()",
    [tokenHash]
  );
  return rows[0] || null;
}

async function clearResetToken(id, newPasswordHash) {
  await pool.query(
    "UPDATE users SET password=$1, reset_password_token=NULL, reset_password_expires=NULL, updated_at=NOW() WHERE id=$2",
    [newPasswordHash, id]
  );
}

module.exports = { findByEmail, findById, findAll, create, update, updateRole, updatePassword, disable, updateAddresses, updateWishlist, updateCart, comparePassword, setResetToken, findByResetToken, clearResetToken };
