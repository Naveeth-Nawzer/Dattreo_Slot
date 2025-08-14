const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/BookingController');

router.get('/slots/config', bookingController.getConfig);
router.get('/slots/:slotId/status', bookingController.getSlotStatus);
router.post('/bookings', bookingController.createBooking);
router.post('/slots/:slotId/book', bookingController.bookSlot);

module.exports = router;