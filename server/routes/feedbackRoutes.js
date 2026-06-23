const express = require('express');
const router = express.Router(); 

const { submitFeedback, getFeedbacks } = require('../controllers/feedbackController');

// Public routes
router.post('/', submitFeedback);
router.get('/', getFeedbacks);

module.exports = router;