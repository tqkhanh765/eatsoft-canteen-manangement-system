require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

// ── Middleware ────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/roles',       require('./src/routes/roleRoutes'));
app.use('/api/users',       require('./src/routes/userRoutes'));
app.use('/api/stores',      require('./src/routes/storeRoutes'));
app.use('/api/categories',  require('./src/routes/categoryRoutes'));
app.use('/api/products',    require('./src/routes/productRoutes'));
app.use('/api/orders',      require('./src/routes/orderRoutes'));
app.use('/api/order-items', require('./src/routes/orderItemRoutes'));
app.use('/api/feedbacks',   require('./src/routes/feedbackRoutes'));

// ── Health check ──────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ──────────────────────────────────────────
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));