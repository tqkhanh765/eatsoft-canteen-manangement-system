const prisma = require('../lib/prisma');

// GET /roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({ orderBy: { roleId: 'asc' } });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /roles/:id
const getRoleById = async (req, res) => {
  try {
    const role = await prisma.role.findUnique({ where: { roleId: Number(req.params.id) } });
    if (!role) return res.status(404).json({ error: 'Role not found' });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /roles
const createRole = async (req, res) => {
  try {
    const { roleName } = req.body;
    const role = await prisma.role.create({ data: { roleName } });
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /roles/:id
const updateRole = async (req, res) => {
  try {
    const { roleName } = req.body;
    const role = await prisma.role.update({
      where: { roleId: Number(req.params.id) },
      data:  { roleName },
    });
    res.json(role);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Role not found' });
    res.status(500).json({ error: err.message });
  }
};

// DELETE /roles/:id
const deleteRole = async (req, res) => {
  try {
    await prisma.role.delete({ where: { roleId: Number(req.params.id) } });
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Role not found' });
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllRoles, getRoleById, createRole, updateRole, deleteRole };