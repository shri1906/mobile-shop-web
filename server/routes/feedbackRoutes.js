const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  submitFeedback, getFeedbacks, getAllFeedbacks,
  updateFeedback, deleteFeedback, seedFeedback
} = require('../controllers/feedbackController');

router.get('/', getFeedbacks);
router.post('/', submitFeedback);
router.get('/admin/all', protect, adminOnly, getAllFeedbacks);
router.post('/seed', protect, adminOnly, seedFeedback);
router.put('/:id', protect, adminOnly, updateFeedback);
router.delete('/:id', protect, adminOnly, deleteFeedback);

module.exports = router;
