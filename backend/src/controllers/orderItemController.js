const prisma = require('../lib/prisma');

// GET /order-items  (supports ?orderId= filter)
const getAllOrderItems = async (req, res) => {
  try {
    const { orderId } = req.query;
    const items = await prisma.orderItem.findMany({
      where:   orderId ? { orderId: Number(orderId) } : undefined,
      orderBy: { orderItemId: 'asc' },
      include: { product: true },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /order-items/:id
const getOrderItemById = async (req, res) => {
  try {
    const item = await prisma.orderItem.findUnique({
      where:   { orderItemId: Number(req.params.id) },
      include: { product: true },
    });
    if (!item) return res.status(404).json({ error: 'Order item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /order-items
const createOrderItem = async (req, res) => {
  try {
    const { orderId, productId, quantity, unitPrice } = req.body;
    const item = await prisma.orderItem.create({
      data: {
        orderId:   Number(orderId),
        productId: Number(productId),
        quantity:  Number(quantity),
        unitPrice: Number(unitPrice),
      },
      include: { product: true },
    });
    // Recalculate order totalAmount
    await recalcOrderTotal(Number(orderId));
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /order-items/:id
const updateOrderItem = async (req, res) => {
  try {
    const { quantity, unitPrice } = req.body;
    const item = await prisma.orderItem.update({
      where: { orderItemId: Number(req.params.id) },
      data:  { quantity: Number(quantity), unitPrice: Number(unitPrice) },
      include: { product: true },
    });
    await recalcOrderTotal(item.orderId);
    res.json(item);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Order item not found' });
    res.status(500).json({ error: err.message });
  }
};

// DELETE /order-items/:id
const deleteOrderItem = async (req, res) => {
  try {
    const item = await prisma.orderItem.delete({
      where: { orderItemId: Number(req.params.id) },
    });
    await recalcOrderTotal(item.orderId);
    res.json({ message: 'Order item deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Order item not found' });
    res.status(500).json({ error: err.message });
  }
};

// ── Helper: recalculate totalAmount on the parent order ──────────
async function recalcOrderTotal(orderId) {
  const agg = await prisma.orderItem.aggregate({
    where:  { orderId },
    _sum:   { unitPrice: true },  // Note: real total = Σ(unitPrice * quantity)
  });
  // Use groupBy workaround since Prisma doesn't support multiplying in aggregate
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  const totalAmount = items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0);
  await prisma.order.update({ where: { orderId }, data: { totalAmount } });
}

module.exports = { getAllOrderItems, getOrderItemById, createOrderItem, updateOrderItem, deleteOrderItem };