const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');

router.get('/',                       ctrl.getAllOrders);
router.get('/stats/peak-hours',       ctrl.getPeakOrderingHours);
router.get('/stats/peak-day',         ctrl.getPeakDay);
router.get('/stats/top-ordering',     ctrl.getTopOrderingByStore);
router.get('/stats/performance',      ctrl.getStorePerformanceByDate);
router.get('/:id',                    ctrl.getOrderById);
router.post('/',                      ctrl.createOrder);
router.patch('/:id/status',           ctrl.updateOrderStatus);
router.delete('/:id',                 ctrl.deleteOrder);

module.exports = router;