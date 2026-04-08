const pool = require('../db/pool');

// GET /feedbacks  (supports ?store_id=&user_id= filters)
const getAllFeedbacks = async (req, res) => {
  try {
    const { store_id, user_id } = req.query;
    let query = `
      SELECT f.*, u.name AS customer_name, s.name AS store_name, o.status AS order_status
      FROM feedbacks f
      LEFT JOIN users u ON f.user_id = u.id
      LEFT JOIN stores s ON f.store_id = s.id
      LEFT JOIN orders o ON f.order_id = o.id
      WHERE 1=1
    `;
    const params = [];
    if (store_id) { params.push(store_id); query += ` AND f.store_id = $${params.length}`; }
    if (user_id)  { params.push(user_id);  query += ` AND f.user_id = $${params.length}`; }
    query += ' ORDER BY f.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /feedbacks/:id
const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT f.*, u.name AS customer_name, s.name AS store_name
       FROM feedbacks f
       LEFT JOIN users u ON f.user_id = u.id
       LEFT JOIN stores s ON f.store_id = s.id
       WHERE f.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Feedback not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /feedbacks
const createFeedback = async (req, res) => {
  try {
    const { user_id, store_id, order_id, rating, comment } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    const result = await pool.query(
      `INSERT INTO feedbacks (user_id, store_id, order_id, rating, comment)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [user_id, store_id, order_id, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Feedback already submitted for this order' });
    res.status(500).json({ error: err.message });
  }
};

// PUT /feedbacks/:id
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    const result = await pool.query(
      `UPDATE feedbacks SET rating=$1, comment=$2, updated_at=NOW() WHERE id=$3 RETURNING *`,
      [rating, comment, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Feedback not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /feedbacks/:id
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM feedbacks WHERE id=$1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllFeedbacks, getFeedbackById, createFeedback, updateFeedback, deleteFeedback };