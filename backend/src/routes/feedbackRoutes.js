const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/feedbackController');

router.get('/',       ctrl.getAllFeedbacks);
router.get('/:id',    ctrl.getFeedbackById);
router.post('/',      ctrl.createFeedback);
router.put('/:id',    ctrl.updateFeedback);
router.delete('/:id', ctrl.deleteFeedback);

module.exports = router;