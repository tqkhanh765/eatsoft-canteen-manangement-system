const prisma = require('../lib/prisma');

const VALID_STATUSES = ['Pending', 'Cooking', 'Ready', 'Delivering', 'Completed', 'Cancelled'];

// GET /orders  (supports ?userId=&storeId=&status= filters)
const getAllOrders = async (req, res) => {
  try {
    const { userId, storeId, status } = req.query;
    const orders = await prisma.order.findMany({
      where: {
        ...(userId  && { userId:  Number(userId)  }),
        ...(storeId && { storeId: Number(storeId) }),
        ...(status  && { status }),
      },
      orderBy: { orderDate: 'desc' },
      include: {
        user:       { omit: { password: true } },
        store:      true,
        orderItems: { include: { product: true } },
      },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /orders/:id  (with items)
const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where:   { orderId: Number(req.params.id) },
      include: {
        user:       { omit: { password: true } },
        store:      true,
        orderItems: { include: { product: true } },
      },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /orders  (creates order + order items in a transaction)
// Body: { userId, storeId, status?, items: [{ productId, quantity, unitPrice }] }
const createOrder = async (req, res) => {
  try {
    const { userId, storeId, status, items } = req.body;
    const totalAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId:      Number(userId),
        storeId:     Number(storeId),
        status:      status ?? 'Pending',
        totalAmount,
        orderItems: {
          create: items.map(i => ({
            productId: Number(i.productId),
            quantity:  i.quantity,
            unitPrice: i.unitPrice,
          })),
        },
      },
      include: { orderItems: { include: { product: true } } },
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }
    const order = await prisma.order.update({
      where: { orderId: Number(req.params.id) },
      data:  { status },
    });
    res.json(order);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Order not found' });
    res.status(500).json({ error: err.message });
  }
};

// DELETE /orders/:id
const deleteOrder = async (req, res) => {
  try {
    await prisma.order.delete({ where: { orderId: Number(req.params.id) } });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Order not found' });
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder };