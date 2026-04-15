const prisma = require('../lib/prisma');

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { userId: 'asc' },
      include: { role: true },
      // never expose passwords
      omit: { password: true },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where:   { userId: Number(req.params.id) },
      include: { role: true },
      omit:    { password: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /users
const createUser = async (req, res) => {
  try {
    const { userName, email, password, phone, status, roleId } = req.body;
    const user = await prisma.user.create({
      data: { userName, email, password, phone, status: status ?? 'active', roleId: Number(roleId) },
      omit: { password: true },
    });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
};

// PUT /users/:id
const updateUser = async (req, res) => {
  try {
    const { userName, email, phone, status, roleId } = req.body;
    const user = await prisma.user.update({
      where: { userId: Number(req.params.id) },
      data:  { userName, email, phone, status, roleId: roleId ? Number(roleId) : undefined },
      omit:  { password: true },
    });
    res.json(user);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    if (err.code === 'P2002') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
};

// DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { userId: Number(req.params.id) } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };