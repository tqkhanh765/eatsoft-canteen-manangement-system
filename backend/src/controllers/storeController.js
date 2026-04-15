const prisma = require('../lib/prisma');

// GET /stores
const getAllStores = async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { storeId: 'asc' },
      include: { manager: { omit: { password: true } } },
    });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /stores/:id
const getStoreById = async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where:   { storeId: Number(req.params.id) },
      include: { manager: { omit: { password: true } }, products: true },
    });
    if (!store) return res.status(404).json({ error: 'Store not found' });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /stores
const createStore = async (req, res) => {
  try {
    const { storeName, description, location, isOpen, managerId } = req.body;
    const store = await prisma.store.create({
      data: {
        storeName,
        description,
        location,
        isOpen: isOpen ?? true,
        managerId: Number(managerId),
      },
    });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /stores/:id
const updateStore = async (req, res) => {
  try {
    const { storeName, description, location, isOpen } = req.body;
    const store = await prisma.store.update({
      where: { storeId: Number(req.params.id) },
      data:  { storeName, description, location, isOpen },
    });
    res.json(store);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Store not found' });
    res.status(500).json({ error: err.message });
  }
};

// PATCH /stores/:id/toggle  – flip isOpen
const toggleStoreStatus = async (req, res) => {
  try {
    const current = await prisma.store.findUnique({ where: { storeId: Number(req.params.id) } });
    if (!current) return res.status(404).json({ error: 'Store not found' });
    const store = await prisma.store.update({
      where: { storeId: current.storeId },
      data:  { isOpen: !current.isOpen },
    });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /stores/:id
const deleteStore = async (req, res) => {
  try {
    await prisma.store.delete({ where: { storeId: Number(req.params.id) } });
    res.json({ message: 'Store deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Store not found' });
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllStores, getStoreById, createStore, updateStore, toggleStoreStatus, deleteStore };