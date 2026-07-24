const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const PUBLIC_FIELDS = "id, name, email, role, avatar, phone, addresses, wishlist, cart, is_verified, created_at";

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
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'customer') RETURNING id, name, email, role",
    [name, email.toLowerCase(), hash]
  );
  return rows[0];
}

async function createVerified({ name, email, passwordHash }) {
  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password, role, is_verified) VALUES ($1, $2, $3, 'customer', TRUE) RETURNING id, name, email, role",
    [name, email.toLowerCase(), passwordHash]
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

async function updateEmail(id, email) {
  const { rows } = await pool.query(
    `UPDATE users SET email=$1, updated_at=NOW() WHERE id=$2 RETURNING ${PUBLIC_FIELDS}`,
    [email.toLowerCase(), id]
  );
  return rows[0];
}

async function findByEmailExcluding(email, excludeId) {
  const { rows } = await pool.query(
    "SELECT id FROM users WHERE email=$1 AND id!=$2",
    [email.toLowerCase(), excludeId]
  );
  return rows[0] || null;
}

async function updateRole(id, role) {
  if (!["customer", "admin"].includes(role))
    throw new Error("Invalid role");
  const { rows } = await pool.query(
    `UPDATE users SET role=$1, updated_at=NOW() WHERE id=$2 RETURNING ${PUBLIC_FIELDS}`,
    [role, id]
  );
  return rows[0] || null;
}

async function updatePassword(id, password) {
  const hash = await bcrypt.hash(password, 10);
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

// ── Pending signups (stored in DB so server restarts don't lose them) ────────
async function setPendingSignup({ email, name, passwordHash, otpHash, expiresAt }) {
  await pool.query(
    `INSERT INTO pending_signups (email, name, password_hash, otp_hash, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE SET name=$2, password_hash=$3, otp_hash=$4, expires_at=$5`,
    [email, name, passwordHash, otpHash, expiresAt]
  );
}

async function findPendingSignup(email) {
  const { rows } = await pool.query(
    "SELECT * FROM pending_signups WHERE email=$1 AND expires_at > NOW()",
    [email]
  );
  return rows[0] || null;
}

async function deletePendingSignup(email) {
  await pool.query("DELETE FROM pending_signups WHERE email=$1", [email]);
}

// ── OTP ──────────────────────────────────────────────────
async function setOtp(id, otpHash, expires) {
  await pool.query(
    "UPDATE users SET otp_hash=$1, otp_expires=$2, updated_at=NOW() WHERE id=$3",
    [otpHash, expires, id]
  );
}

async function findByOtp(otpHash) {
  const { rows } = await pool.query(
    "SELECT id, name, email, is_verified FROM users WHERE otp_hash=$1 AND otp_expires > NOW()",
    [otpHash]
  );
  return rows[0] || null;
}

async function markVerified(id) {
  await pool.query(
    "UPDATE users SET is_verified=TRUE, otp_hash=NULL, otp_expires=NULL, updated_at=NOW() WHERE id=$1",
    [id]
  );
}

module.exports = { findByEmail, findById, findAll, create, createVerified, update, updateEmail, findByEmailExcluding, updateRole, updatePassword, disable, updateAddresses, updateWishlist, updateCart, comparePassword, setResetToken, findByResetToken, clearResetToken, setOtp, findByOtp, markVerified, setPendingSignup, findPendingSignup, deletePendingSignup };
