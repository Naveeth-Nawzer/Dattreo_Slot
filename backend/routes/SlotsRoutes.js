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
const slotsController = require('../controllers/slotsController');

// GET all slots
router.get('/', slotsController.getAllSlots);

// GET current config
router.get('/config', slotsController.getConfig);

// UPDATE config
router.put('/config', slotsController.updateConfig);

// BOOK a slot
router.post('/:id/book', slotsController.bookSlot);

module.exports = router;