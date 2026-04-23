const prisma = require('../lib/prisma');

/**
 * Build a Prisma date-range filter object from optional startDate / endDate strings.
 * endDate is expanded to end-of-day so the full day is included.
 * Returns null when neither date is provided (meaning: no filter).
 */
const buildDateFilter = (startDate, endDate) => {
  if (!startDate && !endDate) return null;
  const filter = {};
  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    filter.gte = start;
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    filter.lte = end;
  }
  return filter;
};

const VALID_STATUSES = ['PENDING', 'ACCEPTED', 'COOKING', 'COMPLETED'];

// GET /orders  (supports ?userId=&storeId=&status= filters)
const getAllOrders = async (req, res) => {
  try {
    const { userId, storeId, status } = req.query;
    const orders = await prisma.order.findMany({
      where: {
        ...(userId  && { userId:  Number(userId)  }),
        ...(storeId && { storeId: Number(storeId) }),
        ...(status  && { status: status.toUpperCase() }),
      },
      orderBy: { orderDate: 'desc' },
      include: {
        user: {
          select: {
            userId: true,
            userName: true,
            email: true,
            phone: true,
            status: true,
            studentId: true,
            universityName: true,
            country: true,
            roleId: true,
            role: true
          }
        },
        store:      true,
        orderItems: { include: { product: { include: { store: true } } } },
      },
    });
    console.log('getAllOrders - Sample order items:', orders[0]?.orderItems?.[0]);
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
        user: {
          select: {
            userId: true,
            userName: true,
            email: true,
            phone: true,
            status: true,
            studentId: true,
            universityName: true,
            country: true,
            roleId: true,
            role: true
          }
        },
        store:      true,
        orderItems: { include: { product: { include: { store: true } } } },
      },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    console.log('Order found:', order); // Added debug logging
    res.json(order);
  } catch (err) {
    console.error('Error getting order by id:', err); // Added debug logging
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
        status:      status ?? 'PENDING',
        totalAmount,
        orderItems: {
          create: items.map(i => ({
            productId: Number(i.productId),
            quantity:  i.quantity,
            unitPrice: i.unitPrice,
            note:      i.note || null,
          })),
        },
      },
      include: { orderItems: { include: { product: true } } },
    });

    // Increment soldCount for each product
    for (const item of items) {
      await prisma.product.update({
        where: { productId: Number(item.productId) },
        data: { soldCount: { increment: item.quantity } }
      });
    }

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

// POST /orders/:id/items  (add item to existing order)
const addItemToOrder = async (req, res) => {
  try {
    const { productId, quantity, unitPrice, note } = req.body;
    const orderId = Number(req.params.id);

    // Check if order exists and is pending
    const order = await prisma.order.findUnique({
      where: { orderId },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'PENDING') return res.status(400).json({ error: 'Can only add items to pending orders' });

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { productId: Number(productId) },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check if product is from the same store
    if (product.storeId !== order.storeId) {
      return res.status(400).json({ error: 'Cannot add items from different stores to the same order' });
    }

    // Check if item already exists in order
    const existingItem = await prisma.orderItem.findFirst({
      where: {
        orderId,
        productId: Number(productId),
      },
    });

    let orderItem;
    if (existingItem) {
      // Update quantity if item exists
      orderItem = await prisma.orderItem.update({
        where: { orderItemId: existingItem.orderItemId },
        data: {
          quantity: existingItem.quantity + Number(quantity),
          unitPrice: Number(unitPrice),
          note: note || existingItem.note,
        },
      });
    } else {
      // Create new item
      orderItem = await prisma.orderItem.create({
        data: {
          orderId,
          productId: Number(productId),
          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
          note: note || null,
        },
      });
    }

    // Recalculate total amount
    const allItems = await prisma.orderItem.findMany({ where: { orderId } });
    const totalAmount = allItems.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);

    await prisma.order.update({
      where: { orderId },
      data: { totalAmount },
    });

    res.status(201).json(orderItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /orders/stats/peak-hours - Get order count by hour of day
const getPeakOrderingHours = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build optional date range filter
    const dateFilter = buildDateFilter(startDate, endDate);

    const orders = await prisma.order.findMany({
      where: dateFilter ? { orderDate: dateFilter } : undefined,
      select: { orderDate: true },
    });

    const hourlyData = [
      { time: '8:00 AM',  orders: 0, hour: 8  },
      { time: '9:00 AM',  orders: 0, hour: 9  },
      { time: '10:00 AM', orders: 0, hour: 10 },
      { time: '11:00 AM', orders: 0, hour: 11 },
      { time: '12:00 PM', orders: 0, hour: 12 },
      { time: '1:00 PM',  orders: 0, hour: 13 },
      { time: '2:00 PM',  orders: 0, hour: 14 },
    ];

    orders.forEach(order => {
      const hour = new Date(order.orderDate).getHours();
      const slot = hourlyData.find(h => h.hour === hour);
      if (slot) slot.orders += 1;
    });

    res.json(hourlyData.map(({ time, orders }) => ({ time, orders })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /orders/stats/peak-day - Get order count by day of week
const getPeakDay = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    const orders = await prisma.order.findMany({
      where: dateFilter ? { orderDate: dateFilter } : undefined,
      select: { orderDate: true },
    });

    const dayData = [
      { day: 'Monday',    orders: 0 },
      { day: 'Tuesday',   orders: 0 },
      { day: 'Wednesday', orders: 0 },
      { day: 'Thursday',  orders: 0 },
      { day: 'Friday',    orders: 0 },
      { day: 'Saturday',  orders: 0 },
      { day: 'Sunday',    orders: 0 },
    ];

    orders.forEach(order => {
      const dayIndex = new Date(order.orderDate).getDay();
      const idx = dayIndex === 0 ? 6 : dayIndex - 1;
      dayData[idx].orders += 1;
    });

    res.json(dayData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /orders/stats/top-ordering - Get total products ordered by store
const getTopOrderingByStore = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = buildDateFilter(startDate, endDate);

    const allStores = await prisma.store.findMany({
      select: { storeId: true, storeName: true },
    });

    // Filter order items via orders that fall in the date range
    const orderItems = await prisma.orderItem.findMany({
      where: dateFilter
        ? { order: { orderDate: dateFilter } }
        : undefined,
      include: {
        product: { include: { store: true } },
      },
    });

    const storeQuantities = {};
    allStores.forEach(store => { storeQuantities[store.storeName] = 0; });

    orderItems.forEach(item => {
      const storeName = item.product?.store?.storeName;
      if (storeName && Object.prototype.hasOwnProperty.call(storeQuantities, storeName)) {
        storeQuantities[storeName] += item.quantity;
      }
    });

    const result = Object.entries(storeQuantities)
      .map(([name, products]) => ({ name, products }))
      .sort((a, b) => b.products - a.products);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /orders/stats/performance - Get average rating, daily orders and income by store for a specific date
const getStorePerformanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    // Get all stores
    const allStores = await prisma.store.findMany({
      select: {
        storeId:   true,
        storeName: true,
        isOpen:    true,
      },
    });

    // Calculate date range for the selected date (start and end of day)
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get orders for the specific date
    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        store: true,
      },
    });

    // Get all feedbacks with store info
    const feedbacks = await prisma.feedback.findMany({
      include: {
        orderItem: {
          include: {
            product: {
              include: {
                store: true,
              },
            },
          },
        },
      },
    });

    // Initialize store performance data
    const storePerformance = {};
    allStores.forEach(store => {
      storePerformance[store.storeName] = {
        storeName:    store.storeName,
        isOpen:       store.isOpen,
        avgRating:    0,
        dailyOrders:  0,
        dailyIncome:  0,
        ratingCount:  0,
        ratingSum:    0,
      };
    });

    // Calculate average ratings by store
    feedbacks.forEach(feedback => {
      const storeName = feedback.orderItem?.product?.store?.storeName;
      if (storeName && storePerformance.hasOwnProperty(storeName)) {
        storePerformance[storeName].ratingSum += feedback.rating;
        storePerformance[storeName].ratingCount += 1;
      }
    });

    // Calculate daily orders and income by store
    orders.forEach(order => {
      const storeName = order.store?.storeName;
      if (storeName && storePerformance.hasOwnProperty(storeName)) {
        storePerformance[storeName].dailyOrders += 1;
        storePerformance[storeName].dailyIncome += Number(order.totalAmount);
      }
    });

    // Calculate average ratings and format result
    const result = Object.values(storePerformance).map(store => ({
      storeName:   store.storeName,
      isOpen:      store.isOpen,
      avgRating:   store.ratingCount > 0 ? (store.ratingSum / store.ratingCount).toFixed(1) : '0.0',
      dailyOrders: store.dailyOrders,
      dailyIncome: store.dailyIncome.toFixed(0),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder, addItemToOrder, getPeakOrderingHours, getPeakDay, getTopOrderingByStore, getStorePerformanceByDate };