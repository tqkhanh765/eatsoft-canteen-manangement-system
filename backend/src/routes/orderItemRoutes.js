const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderItemController');

router.get('/',       ctrl.getAllOrderItems);
router.get('/:id',    ctrl.getOrderItemById);
router.post('/',      ctrl.createOrderItem);
router.put('/:id',    ctrl.updateOrderItem);
router.delete('/:id', ctrl.deleteOrderItem);

module.exports = router;