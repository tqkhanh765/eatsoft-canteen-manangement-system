const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/storeController');

router.get('/',              ctrl.getAllStores);
router.get('/:id',           ctrl.getStoreById);
router.post('/',             ctrl.createStore);
router.put('/:id',           ctrl.updateStore);
router.patch('/:id/toggle',  ctrl.toggleStoreStatus);
router.delete('/:id',        ctrl.deleteStore);

module.exports = router;