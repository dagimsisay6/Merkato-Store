const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const PUBLIC_FIELDS = "id, name, email, role, avatar, phone, addresses, wishlist, created_at";

async function findByEmail(email) {
  const { rows } = await pool.query("SELECT *, password FROM users WHERE email = $1", [email.toLowerCase()]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`, [id]);
  return rows[0] || null;
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

async function updateAddresses(id, addresses) {
  const { rows } = await pool.query(
    `UPDATE users SET addresses=$1, updated_at=NOW() WHERE id=$2 RETURNING ${PUBLIC_FIELDS}`,
    [JSON.stringify(addresses), id]
  );
  return rows[0];
}

function comparePassword(candidate, hash) {
  return bcrypt.compare(candidate, hash);
}

module.exports = { findByEmail, findById, create, update, updateAddresses, comparePassword };
