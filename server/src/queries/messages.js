const pool = require("../config/db");

async function create({ name, email, phone, subject, message }) {
  const { rows } = await pool.query(
    `INSERT INTO contact_messages (name, email, phone, subject, message)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, phone || null, subject, message]
  );
  return rows[0];
}

async function findAll({ page = 1, limit = 20, status, search } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const conditions = ["is_deleted = FALSE"];
  const params = [];

  if (status && status !== "all") {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (search) {
    const idx = params.length + 1;
    params.push(`%${search}%`);
    conditions.push(`(name ILIKE $${idx} OR email ILIKE $${idx} OR subject ILIKE $${idx})`);
  }

  const where = conditions.join(" AND ");
  params.push(Number(limit), offset);

  const { rows } = await pool.query(
    `SELECT * FROM contact_messages WHERE ${where}
     ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*) FROM contact_messages WHERE ${where}`,
    params.slice(0, -2)
  );

  return { messages: rows, total: Number(countRows[0].count) };
}

async function findById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM contact_messages WHERE id = $1 AND is_deleted = FALSE",
    [id]
  );
  return rows[0] || null;
}

async function updateStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE contact_messages SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [status, id]
  );
  return rows[0] || null;
}

async function assignAdmin(id, adminId) {
  const { rows } = await pool.query(
    `UPDATE contact_messages SET assigned_admin=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [adminId, id]
  );
  return rows[0] || null;
}

async function softDelete(id) {
  const { rows } = await pool.query(
    `UPDATE contact_messages SET is_deleted=TRUE, status='archived', updated_at=NOW() WHERE id=$1 RETURNING *`,
    [id]
  );
  return rows[0] || null;
}

async function restore(id) {
  const { rows } = await pool.query(
    `UPDATE contact_messages SET is_deleted=FALSE, status='read', updated_at=NOW() WHERE id=$1 RETURNING *`,
    [id]
  );
  return rows[0] || null;
}

async function countUnread() {
  const { rows } = await pool.query(
    "SELECT COUNT(*) FROM contact_messages WHERE status='unread' AND is_deleted=FALSE"
  );
  return Number(rows[0].count);
}

// Replies
async function createReply({ messageId, adminId, reply }) {
  const { rows } = await pool.query(
    `INSERT INTO message_replies (message_id, admin_id, reply) VALUES ($1,$2,$3) RETURNING *`,
    [messageId, adminId, reply]
  );
  return rows[0];
}

async function getReplies(messageId) {
  const { rows } = await pool.query(
    `SELECT r.*, u.name AS admin_name, u.email AS admin_email
     FROM message_replies r
     LEFT JOIN users u ON u.id = r.admin_id
     WHERE r.message_id = $1
     ORDER BY r.created_at ASC`,
    [messageId]
  );
  return rows;
}

module.exports = { create, findAll, findById, updateStatus, assignAdmin, softDelete, restore, countUnread, createReply, getReplies };
