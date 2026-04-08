const pool = require('../db/pool');

// GET /products  (supports ?store_id=&category_id= filters)
const getAllProducts = async (req, res) => {
  try {
    const { store_id, category_id } = req.query;
    let query = `
      SELECT p.*, s.name AS store_name, c.name AS category_name
      FROM products p
      LEFT JOIN stores s ON p.store_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (store_id) { params.push(store_id); query += ` AND p.store_id = $${params.length}`; }
    if (category_id) { params.push(category_id); query += ` AND p.category_id = $${params.length}`; }
    query += ' ORDER BY p.id ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, s.name AS store_name, c.name AS category_name
       FROM products p
       LEFT JOIN stores s ON p.store_id = s.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image_url, store_id, category_id, is_available } = req.body;
    const result = await pool.query(
      `INSERT INTO products (name, description, price, image_url, store_id, category_id, is_available)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, description, price, image_url, store_id, category_id, is_available ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category_id, is_available } = req.body;
    const result = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, image_url=$4,
       category_id=$5, is_available=$6, updated_at=NOW() WHERE id=$7 RETURNING *`,
      [name, description, price, image_url, category_id, is_available, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /products/:id/sold-out
const markSoldOut = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE products SET is_available=false, updated_at=NOW() WHERE id=$1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, markSoldOut, deleteProduct };