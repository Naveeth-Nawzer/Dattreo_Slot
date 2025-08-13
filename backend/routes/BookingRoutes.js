// // In your routes file (e.g., bookingRoutes.js)
// const express = require('express');
// const router = express.Router();
// const BookingController = require('../Controllers/BookingController');

// router.post('/createBooking', BookingController.createBooking);

// module.exports = router;


const express = require('express');
const router = express.Router();
const BookingController = require('../Controllers/BookingController');

router.post('/createBooking', BookingController.createBooking);
router.post('/slots/:slotId/book', BookingController.bookSlot); // Add this route

module.exports = router;