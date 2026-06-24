const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { register, login, getMe, seedAdmin } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/seed-admin', seedAdmin);

module.exports = router;
