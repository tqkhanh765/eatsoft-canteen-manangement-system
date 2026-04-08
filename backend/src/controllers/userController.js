const pool = require('../db/pool');
const bcrypt = require('bcrypt');

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT u.id, u.name, u.email, u.phone, u.role_id, r.name AS role, u.created_at FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT u.id, u.name, u.email, u.phone, u.role_id, r.name AS role, u.created_at FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /users
const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role_id } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, phone, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role_id, created_at',
      [name, email, password_hash, phone, role_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
};

// PUT /users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role_id } = req.body;
    const result = await pool.query(
      'UPDATE users SET name=$1, email=$2, phone=$3, role_id=$4, updated_at=NOW() WHERE id=$5 RETURNING id, name, email, phone, role_id, updated_at',
      [name, email, phone, role_id, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };