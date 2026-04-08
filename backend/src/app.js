require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/roles',       require('./routes/roleRoutes'));
app.use('/api/users',       require('./routes/userRoutes'));
app.use('/api/stores',      require('./routes/storeRoutes'));
app.use('/api/categories',  require('./routes/categoryRoutes'));
app.use('/api/products',    require('./routes/productRoutes'));
app.use('/api/orders',      require('./routes/orderRoutes'));
app.use('/api/order-items', require('./routes/orderItemRoutes'));
app.use('/api/feedbacks',   require('./routes/feedbackRoutes'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;