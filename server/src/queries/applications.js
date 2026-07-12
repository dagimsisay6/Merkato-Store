const pool = require("../config/db");

async function create({ position, firstName, lastName, email, phone, location, linkedin, portfolio, experience, coverLetter, resumeUrl }) {
  const { rows } = await pool.query(
    `INSERT INTO job_applications
      (position, first_name, last_name, email, phone, location, linkedin, portfolio, experience, cover_letter, resume_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [position, firstName, lastName, email, phone || null, location, linkedin || null, portfolio || null, experience, coverLetter, resumeUrl || null]
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
    conditions.push(`(first_name ILIKE $${idx} OR last_name ILIKE $${idx} OR email ILIKE $${idx} OR position ILIKE $${idx})`);
  }

  const where = conditions.join(" AND ");
  params.push(Number(limit), offset);

  const [data, count] = await Promise.all([
    pool.query(`SELECT * FROM job_applications WHERE ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`, params),
    pool.query(`SELECT COUNT(*) FROM job_applications WHERE ${where}`, params.slice(0, -2)),
  ]);

  return { applications: data.rows, total: Number(count.rows[0].count) };
}

async function findById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM job_applications WHERE id=$1 AND is_deleted=FALSE", [id]
  );
  return rows[0] || null;
}

async function updateStatus(id, status) {
  const { rows } = await pool.query(
    "UPDATE job_applications SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *", [status, id]
  );
  return rows[0] || null;
}

async function softDelete(id) {
  const { rows } = await pool.query(
    "UPDATE job_applications SET is_deleted=TRUE, status='archived', updated_at=NOW() WHERE id=$1 RETURNING *", [id]
  );
  return rows[0] || null;
}

async function restore(id) {
  const { rows } = await pool.query(
    "UPDATE job_applications SET is_deleted=FALSE, status='reviewing', updated_at=NOW() WHERE id=$1 RETURNING *", [id]
  );
  return rows[0] || null;
}

async function countNew() {
  const { rows } = await pool.query(
    "SELECT COUNT(*) FROM job_applications WHERE status='new' AND is_deleted=FALSE"
  );
  return Number(rows[0].count);
}

async function createReply({ applicationId, adminId, reply }) {
  const { rows } = await pool.query(
    "INSERT INTO application_replies (application_id, admin_id, reply) VALUES ($1,$2,$3) RETURNING *",
    [applicationId, adminId, reply]
  );
  return rows[0];
}

async function getReplies(applicationId) {
  const { rows } = await pool.query(
    `SELECT r.*, u.name AS admin_name FROM application_replies r
     LEFT JOIN users u ON u.id = r.admin_id
     WHERE r.application_id=$1 ORDER BY r.created_at ASC`,
    [applicationId]
  );
  return rows;
}

module.exports = { create, findAll, findById, updateStatus, softDelete, restore, countNew, createReply, getReplies };
