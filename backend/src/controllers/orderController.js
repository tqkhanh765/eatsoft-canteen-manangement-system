const pool = require('../db/pool');

// Valid order statuses matching the app spec
const VALID_STATUSES = ['Pending', 'Cooking', 'Ready', 'Delivering', 'Completed', 'Cancelled'];

// GET /orders  (supports ?user_id=&store_id=&status= filters)
const getAllOrders = async (req, res) => {
  try {
    const { user_id, store_id, status } = req.query;
    let query = `
      SELECT o.*, u.name AS customer_name, s.name AS store_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN stores s ON o.store_id = s.id
      WHERE 1=1
    `;
    const params = [];
    if (user_id)  { params.push(user_id);  query += ` AND o.user_id = $${params.length}`; }
    if (store_id) { params.push(store_id); query += ` AND o.store_id = $${params.length}`; }
    if (status)   { params.push(status);   query += ` AND o.status = $${params.length}`; }
    query += ' ORDER BY o.created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /orders/:id  (with order items)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderResult = await pool.query(
      `SELECT o.*, u.name AS customer_name, s.name AS store_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN stores s ON o.store_id = s.id
       WHERE o.id = $1`,
      [id]
    );
    if (orderResult.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

    const itemsResult = await pool.query(
      `SELECT oi.*, p.name AS product_name, p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );
    res.json({ ...orderResult.rows[0], items: itemsResult.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /orders  (creates order + order items in a transaction)
const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { user_id, store_id, items, delivery_address, note } = req.body;
    // items: [{ product_id, quantity, unit_price }]
    await client.query('BEGIN');

    const total_price = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, store_id, total_price, delivery_address, note, status)
       VALUES ($1,$2,$3,$4,$5,'Pending') RETURNING *`,
      [user_id, store_id, total_price, delivery_address, note]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1,$2,$3,$4)`,
        [order.id, item.product_id, item.quantity, item.unit_price]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ ...order, items });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// PATCH /orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }
    const result = await pool.query(
      'UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /orders/:id
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM orders WHERE id=$1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder };