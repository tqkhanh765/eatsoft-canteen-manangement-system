const prisma = require('../lib/prisma');

// GET /products  (supports ?storeId=&categoryId= filters)
const getAllProducts = async (req, res) => {
  try {
    const { storeId, categoryId } = req.query;
    const products = await prisma.product.findMany({
      where: {
        ...(storeId    && { storeId:    Number(storeId)    }),
        ...(categoryId && { categoryId: Number(categoryId) }),
      },
      orderBy: { productId: 'asc' },
      include: { store: true, category: true },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /products/:id
const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where:   { productId: Number(req.params.id) },
      include: { store: true, category: true },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageURL, isAvailable, storeId, categoryId } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price:       Number(price),
        imageURL,
        isAvailable: isAvailable ?? true,
        storeId:     Number(storeId),
        categoryId:  Number(categoryId),
      },
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, imageURL, isAvailable, categoryId } = req.body;
    const product = await prisma.product.update({
      where: { productId: Number(req.params.id) },
      data:  {
        name,
        description,
        price:       price      !== undefined ? Number(price)      : undefined,
        imageURL,
        isAvailable,
        categoryId:  categoryId !== undefined ? Number(categoryId) : undefined,
      },
    });
    res.json(product);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
    res.status(500).json({ error: err.message });
  }
};

// PATCH /products/:id/sold-out
const markSoldOut = async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { productId: Number(req.params.id) },
      data:  { isAvailable: false },
    });
    res.json(product);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
    res.status(500).json({ error: err.message });
  }
};

// DELETE /products/:id
const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { productId: Number(req.params.id) } });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, markSoldOut, deleteProduct };