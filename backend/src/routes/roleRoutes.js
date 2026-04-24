const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/roleController');

router.get('/',       ctrl.getAllRoles);
router.get('/:id',    ctrl.getRoleById);
router.post('/',      ctrl.createRole);
router.put('/:id',    ctrl.updateRole);
router.delete('/:id', ctrl.deleteRole);

module.exports = router;
