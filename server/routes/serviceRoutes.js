const express = require('express');
const router = express.Router();
const { getAllServices, getService,createService, seedServices } = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getAllServices);
router.get('/:id', getService);

// Admin routes
router.post('/', protect, adminOnly, createService);
router.post('/seed', protect, adminOnly, seedServices); 

module.exports = router;