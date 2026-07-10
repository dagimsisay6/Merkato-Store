const pool = require("../config/db");

async function findAll() {
  const { rows } = await pool.query("SELECT * FROM countries WHERE is_active = TRUE ORDER BY name");
  return rows;
}

async function create({ code, name, flag, capital, currency }) {
  const { rows } = await pool.query(
    "INSERT INTO countries (code, name, flag, capital, currency) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [code, name, flag, capital, currency]
  );
  return rows[0];
}

module.exports = { findAll, create };
