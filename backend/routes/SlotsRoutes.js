// const express = require('express');
// const router = express.Router();
// const bookingController = require('../Controllers/BookingController');

// router.get('/slots/config', bookingController.getConfig);
// router.get('/slots/:slotId/status', bookingController.getSlotStatus);
// router.post('/bookings', bookingController.createBooking);
// router.post('/slots/:slotId/book', bookingController.bookSlot);

// module.exports = router;


const express = require('express');
const router = express.Router();
const slotsController = require('../Controllers/SlotsController');

router.route('/config')
  .get(slotsController.getConfig)
  .put(slotsController.updateConfig)
  .post(slotsController.createConfig);

// Slot Management Routes (mounted at /api/slots)
// List all slots -> GET /api/slots
router.get('/', slotsController.getAllSlots);
// Book a slot -> POST /api/slots/:slotId/book
router.post('/:slotId/book', slotsController.bookSlot);
// Cancel booking -> POST /api/slots/:slotId/cancel
router.post('/:slotId/cancel', slotsController.cancelBooking);

// Note: booking/patient routes are handled under /api/bookings

module.exports = router;