// const pool = require("../db/db");

// // Helper: reset slots when config changes
// async function resetSlots(maxSlots) {
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
    
//     await client.query(`DELETE FROM slots`);
//     await client.query(
//       `INSERT INTO slots (slot_number, status)
//        SELECT generate_series(1, $1), 'available'`,
//       [maxSlots]
//     );
    
//     await client.query('COMMIT');
//   } catch (err) {
//     await client.query('ROLLBACK');
//     throw err;
//   } finally {
//     client.release();
//   }
// }

// // Get current configuration
// exports.getConfig = async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT max_slots FROM slot_config WHERE config_id = 1`
//     );
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Configuration not found' 
//       });
//     }
    
//     res.json({ 
//       success: true,
//       max_slots: result.rows[0].max_slots 
//     });
//   } catch (err) {
//     console.error('Error fetching config:', err.message);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to fetch configuration' 
//     });
//   }
// };

// // Update configuration and reset slots
// exports.updateConfig = async (req, res) => {
//   const { max_slots } = req.body;

//   if (!max_slots || isNaN(max_slots) || max_slots < 1) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Invalid max_slots value. Must be a number greater than 0' 
//     });
//   }

//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');

//     // Upsert configuration
//     const result = await client.query(`
//       INSERT INTO slot_config (config_id, max_slots)
//       VALUES (1, $1)
//       ON CONFLICT (config_id) 
//       DO UPDATE SET max_slots = EXCLUDED.max_slots
//       RETURNING max_slots
//     `, [max_slots]);

//     // Reset slots
//     await resetSlots(max_slots);

//     await client.query('COMMIT');
    
//     res.json({ 
//       success: true, 
//       message: 'Configuration updated',
//       max_slots: result.rows[0].max_slots
//     });
//   } catch (err) {
//     await client.query('ROLLBACK');
//     console.error('Update config error:', err);
//     res.status(500).json({ 
//       success: false,
//       message: 'Database error',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   } finally {
//     client.release();
//   }
// };

// // Get all slots (for TrackQueue UI)
// exports.getAllSlots = async (req, res) => {
//   try {
//     const { rows } = await pool.query(`
//       SELECT id, slot_number, status, user_id
//       FROM slots
//       ORDER BY slot_number ASC
//     `);
    
//     res.json({ 
//       success: true,
//       data: rows 
//     });
//   } catch (err) {
//     console.error('Error fetching slots:', err.message);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to fetch slots' 
//     });
//   }
// };

// // Book a slot (for TrackQueue UI)
// exports.bookSlot = async (req, res) => {
//   const { id } = req.params;
//   const { user_id } = req.body;

//   if (!user_id) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Missing user_id' 
//     });
//   }

//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
    
//     // Check if slot exists and is available
//     const check = await client.query(
//       `SELECT status FROM slots WHERE id = $1 FOR UPDATE`,
//       [id]
//     );
    
//     if (check.rowCount === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Slot not found' 
//       });
//     }
    
//     if (check.rows[0].status !== 'available') {
//       await client.query('ROLLBACK');
//       return res.status(409).json({ 
//         success: false, 
//         message: 'Slot not available' 
//       });
//     }

//     // Book slot
//     await client.query(
//       `UPDATE slots 
//        SET status = 'booked', user_id = $1 
//        WHERE id = $2`,
//       [user_id, id]
//     );
    
//     await client.query('COMMIT');
//     res.json({ 
//       success: true, 
//       message: 'Slot booked successfully' 
//     });
//   } catch (err) {
//     await client.query('ROLLBACK');
//     console.error('Error booking slot:', err.message);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to book slot' 
//     });
//   } finally {
//     client.release();
//   }
// };


// let slots = Array(20).fill().map((_, i) => ({
//   id: i + 1,
//   slot_number: i,
//   status: i === 0 ? 'serving' : 'available',
//   user_id: null
// }));

// exports.getAllSlots = (req, res) => {
//   res.json(slots);
// };

// exports.bookSlot = (req, res) => {
//   const slotId = parseInt(req.params.id);
//   const { user_id } = req.body;
  
//   const slot = slots.find(s => s.id === slotId);
//   if (!slot) return res.status(404).send('Slot not found');
  
//   if (slot.status !== 'available') {
//     return res.status(400).send('Slot already booked');
//   }
  
//   slot.status = 'booked';
//   slot.user_id = user_id;
//   res.json(slot);
// };
const pool = require("../db/db");

// Helper: reset slots when config changes
async function resetSlots(maxSlots) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(`DELETE FROM slots`);
    await client.query(
      `INSERT INTO slots (slot_number, status)
       SELECT generate_series(1, $1), 'available'`,
      [maxSlots]
    );
    
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

exports.getConfig = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT max_slots, location FROM slot_config WHERE config_id = 1`
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Configuration not found' 
      });
    }
    
    res.json({ 
      success: true,
      max_slots: result.rows[0].max_slots,
      location: result.rows[0].location || 'main'
    });
  } catch (err) {
    console.error('Error fetching config:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch configuration' 
    });
  }
};

exports.updateConfig = async (req, res) => {
  const { max_slots, location } = req.body;

  if (!max_slots || isNaN(max_slots) || max_slots < 1) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid max_slots value' 
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(`
      INSERT INTO slot_config (config_id, max_slots, location)
      VALUES (1, $1, $2)
      ON CONFLICT (config_id) 
      DO UPDATE SET max_slots = EXCLUDED.max_slots, location = EXCLUDED.location
      RETURNING max_slots, location
    `, [max_slots, location || 'main']);

    await resetSlots(max_slots);
    await client.query('COMMIT');
    
    res.json({ 
      success: true, 
      max_slots: result.rows[0].max_slots,
      location: result.rows[0].location
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ 
      success: false,
      message: 'Database error'
    });
  } finally {
    client.release();
  }
};

exports.getAllSlots = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, slot_number, status, user_id
      FROM slots
      ORDER BY slot_number ASC
    `);
    
    res.json({ 
      success: true,
      data: rows 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch slots' 
    });
  }
};

exports.bookSlot = async (req, res) => {
  const { id } = req.params;
  const { user_id, location } = req.body;

  if (!user_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing user_id' 
    });
  }
  if (!location) {
    return res.status(400).json({
      success: false,
      message: 'Missing location'
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const check = await client.query(
      `SELECT id, status FROM slots WHERE id = $1 FOR UPDATE`,
      [id]
    );
    
    if (check.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        success: false, 
        message: 'Slot not found' 
      });
    }
    
    const currentStatus = (check.rows[0].status || '').toLowerCase();
    if (currentStatus !== 'available') {
      await client.query('ROLLBACK');
      return res.status(409).json({ 
        success: false, 
        message: 'Slot not available' 
      });
    }

    const update = await client.query(
      `UPDATE slots 
       SET status = 'booked', user_id = $1, location = $3, booked_at = NOW()
       WHERE id = $2 AND lower(status) = 'available'
       RETURNING id, slot_number, status, user_id, location, booked_at`,
      [user_id, id, location]
    );

    if (update.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: 'Slot not available'
      });
    }
    
    await client.query('COMMIT');
    res.json({ 
      success: true, 
      message: 'Slot booked successfully',
      slot: update.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ 
      success: false,
      message: 'Failed to book slot' 
    });
  } finally {
    client.release();
  }
};