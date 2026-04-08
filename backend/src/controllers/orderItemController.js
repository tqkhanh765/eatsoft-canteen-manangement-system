const pool = require('../db/pool');

// GET /order-items?order_id=
const getAllOrderItems = async (req, res) => {
  try {
    const { order_id } = req.query;
    let query = `
      SELECT oi.*, p.name AS product_name, p.image_url
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
    `;
    const params = [];
    if (order_id) { params.push(order_id); query += ` WHERE oi.order_id = $1`; }
    query += ' ORDER BY oi.id ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /order-items/:id
const getOrderItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT oi.*, p.name AS product_name, p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /order-items
const createOrderItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity, unit_price } = req.body;
    const result = await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [order_id, product_id, quantity, unit_price]
    );
    // Recalculate order total
    await pool.query(
      `UPDATE orders SET total_price = (
         SELECT SUM(quantity * unit_price) FROM order_items WHERE order_id = $1
       ), updated_at=NOW() WHERE id = $1`,
      [order_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /order-items/:id
const updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, unit_price } = req.body;
    const result = await pool.query(
      `UPDATE order_items SET quantity=$1, unit_price=$2 WHERE id=$3 RETURNING *`,
      [quantity, unit_price, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order item not found' });
    // Recalculate order total
    await pool.query(
      `UPDATE orders SET total_price = (
         SELECT SUM(quantity * unit_price) FROM order_items WHERE order_id = $1
       ), updated_at=NOW() WHERE id = $1`,
      [result.rows[0].order_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /order-items/:id
const deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM order_items WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order item not found' });
    // Recalculate order total
    await pool.query(
      `UPDATE orders SET total_price = (
         SELECT COALESCE(SUM(quantity * unit_price), 0) FROM order_items WHERE order_id = $1
       ), updated_at=NOW() WHERE id = $1`,
      [result.rows[0].order_id]
    );
    res.json({ message: 'Order item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllOrderItems, getOrderItemById, createOrderItem, updateOrderItem, deleteOrderItem };