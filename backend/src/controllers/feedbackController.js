const prisma = require('../lib/prisma');

// GET /feedbacks  (supports ?storeId=&userId= via orderItem → order → store/user)
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orderItem: {
          include: {
            product: true,
            order: {
              include: {
                user:  { omit: { password: true } },
                store: true,
              },
            },
          },
        },
      },
    });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /feedbacks/:id
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await prisma.feedback.findUnique({
      where:   { feedbackId: Number(req.params.id) },
      include: {
        orderItem: {
          include: {
            product: true,
            order: {
              include: {
                user:  { omit: { password: true } },
                store: true,
              },
            },
          },
        },
      },
    });
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /feedbacks
// Body: { orderItemId, rating, comment }
const createFeedback = async (req, res) => {
  try {
    const { orderItemId, rating, comment } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    const feedback = await prisma.feedback.create({
      data: {
        orderItemId: Number(orderItemId),
        rating:      Number(rating),
        comment,
      },
    });
    res.status(201).json(feedback);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Feedback already submitted for this order item' });
    res.status(500).json({ error: err.message });
  }
};

// PUT /feedbacks/:id
const updateFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    const feedback = await prisma.feedback.update({
      where: { feedbackId: Number(req.params.id) },
      data:  { rating: Number(rating), comment },
    });
    res.json(feedback);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Feedback not found' });
    res.status(500).json({ error: err.message });
  }
};

// DELETE /feedbacks/:id
const deleteFeedback = async (req, res) => {
  try {
    await prisma.feedback.delete({ where: { feedbackId: Number(req.params.id) } });
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Feedback not found' });
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllFeedbacks, getFeedbackById, createFeedback, updateFeedback, deleteFeedback };