const pool = require("../config/db");

const WITH_CATEGORY = `
  SELECT p.*, c.name AS category_name, c.slug AS category_slug
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`;

async function findAll({ category, search, sort, featured, isNew, deals, exclude, page = 1, limit = 20 }) {
  const conditions = ["p.is_active = TRUE"];
  const params = [];

  if (category) { params.push(category); conditions.push(`c.slug = $${params.length}`); }
  if (featured) conditions.push("p.is_featured = TRUE");
  if (isNew) conditions.push("p.is_new_arrival = TRUE");
  if (deals) conditions.push("p.original_price IS NOT NULL AND p.original_price > 0");
  if (exclude) { params.push(exclude); conditions.push(`p.id != $${params.length}`); }

  // Fuzzy search: split into tokens, each token must match at least one field
  if (search && search.trim()) {
    const tokens = search.trim().split(/\s+/).filter(Boolean).slice(0, 8);
    for (const token of tokens) {
      params.push(`%${token}%`);
      const n = params.length;
      conditions.push(
        `(p.name ILIKE $${n} OR p.brand ILIKE $${n} OR p.description ILIKE $${n} OR array_to_string(p.tags,'|') ILIKE $${n} OR array_to_string(p.features,'|') ILIKE $${n} OR c.name ILIKE $${n})`
      );
    }
  }

  const sortMap = {
    "price-asc": "p.price ASC",
    "price-desc": "p.price DESC",
    rating: "p.rating DESC",
    newest: "p.created_at DESC",
  };
  const orderBy = sortMap[sort] || "p.created_at DESC";
  const offset = (Number(page) - 1) * Number(limit);

  const where = `WHERE ${conditions.join(" AND ")}`;

  params.push(Number(limit), offset);
  const dataQ = `${WITH_CATEGORY} ${where} ORDER BY ${orderBy} LIMIT $${params.length - 1} OFFSET $${params.length}`;
  const countQ = `SELECT COUNT(*) FROM products p LEFT JOIN categories c ON c.id = p.category_id ${where}`;

  const [data, count] = await Promise.all([
    pool.query(dataQ, params),
    pool.query(countQ, params.slice(0, -2)),
  ]);

  return { products: data.rows, total: Number(count.rows[0].count) };
}

async function findBySlug(slug) {
  const { rows } = await pool.query(`${WITH_CATEGORY} WHERE p.slug = $1 AND p.is_active = TRUE`, [slug]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(`${WITH_CATEGORY} WHERE p.id = $1`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const { name, slug, brand, description, price, original_price, images, category_id, stock, rating, review_count, features, tags, is_featured, is_new_arrival, is_best_seller } = data;
  const { rows } = await pool.query(
    `INSERT INTO products (name,slug,brand,description,price,original_price,images,category_id,stock,rating,review_count,features,tags,is_featured,is_new_arrival,is_best_seller)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
    [name, slug, brand, description, price, original_price, images, category_id, stock, rating, review_count, features, tags, is_featured, is_new_arrival, is_best_seller]
  );
  return rows[0];
}

async function update(id, data) {
  const allowed = ["name","slug","brand","description","price","original_price","images","category_id","stock","features","tags","is_featured","is_new_arrival","is_best_seller","is_active"];
  const entries = Object.entries(data).filter(([k]) => allowed.includes(k));
  if (!entries.length) return findById(id);
  const fields = entries.map(([k], i) => `${k}=$${i + 2}`).join(", ");
  const vals = entries.map(([, v]) => v);
  const { rows } = await pool.query(
    `UPDATE products SET ${fields}, updated_at=NOW() WHERE id=$1 RETURNING *`,
    [id, ...vals]
  );
  return rows[0] || null;
}

async function findByIds(ids) {
  if (!ids?.length) return [];
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
  const { rows } = await pool.query(
    `${WITH_CATEGORY} WHERE p.id IN (${placeholders}) AND p.is_active = TRUE`,
    ids
  );
  return rows;
}

async function softDelete(id) {
  await pool.query("UPDATE products SET is_active=FALSE, updated_at=NOW() WHERE id=$1", [id]);
}

module.exports = { findAll, findBySlug, findById, findByIds, create, update, softDelete };
