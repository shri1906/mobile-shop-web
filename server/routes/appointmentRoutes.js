const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  bookAppointment, getAllAppointments, getMyAppointments,
  updateAppointment, deleteAppointment, getStats
} = require('../controllers/appointmentController');

router.post('/', bookAppointment);
router.get('/my/:email', getMyAppointments);
router.get('/stats', protect, adminOnly, getStats);
router.get('/', protect, adminOnly, getAllAppointments);
router.put('/:id', protect, adminOnly, updateAppointment);
router.delete('/:id', protect, adminOnly, deleteAppointment);

module.exports = router;
