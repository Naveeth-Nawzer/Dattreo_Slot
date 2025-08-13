// const express = require('express');
// const router = express.Router();
// const slotsController = require('../controllers/slotsController');

// // GET current config
// router.get('/config', slotsController.getConfig);

// // UPDATE config - changed from POST to PUT
// router.put('/config', slotsController.updateConfig);

// module.exports = router;


const express = require('express');
const router = express.Router();
const slotsController = require('../Controllers/SlotsController');
// Booking routes (QR generation handled in BookingController via /api routes)

// GET all slots
router.get('/', slotsController.getAllSlots);

// GET current config
router.get('/config', slotsController.getConfig);

// UPDATE config
router.put('/config', slotsController.updateConfig);

// Slot availability status (used by frontend before booking)
router.get('/:slotId/status', async (req, res) => {
  try {
    const { slotId } = req.params;
    const result = await require('../db/db').query(
      `SELECT id, status FROM slots WHERE id = $1`,
      [slotId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ available: false, message: 'Slot not found' });
    }
    const status = (result.rows[0].status || '').toLowerCase();
    res.json({ available: status === 'available', status });
  } catch (err) {
    res.status(500).json({ available: false, message: 'Failed to fetch status' });
  }
});

// NOTE: Do not define POST '/:id/book' here to avoid clashing with '/api/slots/:slotId/book'
// which is handled by BookingController (and generates QR codes).

module.exports = router;