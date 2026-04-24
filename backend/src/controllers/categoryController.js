const prisma = require('../lib/prisma');

// GET /categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { categoryId: 'asc' } });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /categories/:id
const getCategoryById = async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { categoryId: Number(req.params.id) },
    });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /categories
const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const category = await prisma.category.create({ data: { categoryName } });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /categories/:id
const updateCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const category = await prisma.category.update({
      where: { categoryId: Number(req.params.id) },
      data:  { categoryName },
    });
    res.json(category);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    res.status(500).json({ error: err.message });
  }
};

// DELETE /categories/:id
const deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({ where: { categoryId: Number(req.params.id) } });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };