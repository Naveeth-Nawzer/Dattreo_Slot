// // In your routes file (e.g., bookingRoutes.js)
// const express = require('express');
// const router = express.Router();
// const BookingController = require('../Controllers/BookingController');

// router.post('/createBooking', BookingController.createBooking);

// module.exports = router;


const express = require('express');
const router = express.Router();
const BookingController = require('../Controllers/BookingController');

// Mounted at /api/bookings
// Create a booking (patient)
router.post('/', BookingController.createBooking);

// Optional: nested route for slot booking under /api/bookings
// Frontend primarily uses /api/slots/:slotId/book via SlotsRoutes
router.post('/slots/:slotId/book', BookingController.bookSlot);

module.exports = router;