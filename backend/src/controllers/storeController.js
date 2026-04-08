const pool = require('../db/pool');

// GET /stores
const getAllStores = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT s.*, u.name AS owner_name FROM stores s LEFT JOIN users u ON s.owner_id = u.id ORDER BY s.id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /stores/:id
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT s.*, u.name AS owner_name FROM stores s LEFT JOIN users u ON s.owner_id = u.id WHERE s.id = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Store not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /stores
const createStore = async (req, res) => {
  try {
    const { name, description, owner_id, image_url, is_open } = req.body;
    const result = await pool.query(
      'INSERT INTO stores (name, description, owner_id, image_url, is_open) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, description, owner_id, image_url, is_open ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /stores/:id
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, is_open } = req.body;
    const result = await pool.query(
      'UPDATE stores SET name=$1, description=$2, image_url=$3, is_open=$4, updated_at=NOW() WHERE id=$5 RETURNING *',
      [name, description, image_url, is_open, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Store not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /stores/:id/toggle
const toggleStoreStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE stores SET is_open = NOT is_open, updated_at=NOW() WHERE id=$1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Store not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /stores/:id
const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM stores WHERE id=$1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Store not found' });
    res.json({ message: 'Store deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllStores, getStoreById, createStore, updateStore, toggleStoreStatus, deleteStore };