const express = require('express');
const router = express.Router();
const { bookAppointment,getAllAppointments,getMyAppointments,updateStatus } = require('../controllers/appointmentController');

// Public route
router.post('/', bookAppointment);
router.get('/', getAllAppointments);

// User-specific route
router.get('/my/:email', getMyAppointments);
router.patch('/:id/status', updateStatus);

module.exports = router;