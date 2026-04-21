const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');

router.get('/',                ctrl.getAllProducts);
router.get('/popular',         ctrl.getPopularProducts);
router.get('/:id',             ctrl.getProductById);
router.post('/',               ctrl.createProduct);
router.put('/:id',             ctrl.updateProduct);
router.patch('/:id/sold-out',  ctrl.markSoldOut);
router.delete('/:id',          ctrl.deleteProduct);

module.exports = router;