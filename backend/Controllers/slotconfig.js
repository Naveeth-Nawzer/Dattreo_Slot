const express = require('express');
const router = express.Router();
const pool = require('../db/db');
//const { validateConfig } = require('../middleware/validation');

router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM slot_config ORDER BY config_id`
    );

    res.json({
      success: true,
      data: result.rows   // 👈 changed "configurations" → "data"
    });
  } catch (err) {
    console.error('Error fetching all configs:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch configurations'
    });
  }
});

router.get('/allSlot', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT config_id, max_slots, location, department
      FROM slot_config
      ORDER BY config_id
    `);

    // Generate slot rows dynamically from max_slots
    const slots = [];
    result.rows.forEach(config => {
      for (let i = 1; i <= config.max_slots; i++) {
        slots.push({
          id: `${config.config_id}-${i}`,   // unique id per slot
          slot_number: i,
          status: 'available',             // default
          user_id: null,                   // no user yet
          slot_location: config.location,
          patient_department: config.department
        });
      }
    });

    res.json({
      success: true,
      data: slots
    });

  } catch (err) {
    console.error('Error fetching all slots:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch slots'
    });
  }
});




router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `DELETE FROM slot_config 
       WHERE config_id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        success: false,
        message: 'Configuration not found'
      });
    }

    // Reset slots to default after deletion
    await resetSlots(client, 20, 'Main Office', 'General');

    await client.query('COMMIT');
    
    res.json({ 
      success: true,
      message: 'Configuration deleted successfully'
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting config:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete configuration'
    });
  } finally {
    client.release();
  }
});


async function resetSlots(client, maxSlots, location, department) {
  try {
    // Get current slot count
    const currentCount = await client.query('SELECT COUNT(*) FROM slots');
    const currentSlots = parseInt(currentCount.rows[0].count, 10);

    if (maxSlots > currentSlots) {
      // Add new slots if needed
      await client.query(
        `INSERT INTO slots (slot_number, status, location, department)
         SELECT generate_series($1, $2), 'available', $3, $4`,
        [currentSlots + 1, maxSlots, location, department]
      );
    } else if (maxSlots < currentSlots) {
      // Mark excess slots as unavailable (don't delete them)
      await client.query(
        `UPDATE slots 
         SET status = 'unavailable'
         WHERE slot_number > $1`,
        [maxSlots]
      );
    }

    // Update location and department for all active slots
    await client.query(
      `UPDATE slots
       SET location = $1, department = $2
       WHERE slot_number <= $3`,
      [location, department, maxSlots]
    );
  } catch (err) {
    console.error('Error updating slots:', err);
    throw err;
  }
}


async function updateSlots(client, maxSlots, location, department) {
  try {
    // Ensure the slots table exists with required columns
    await client.query(`
      CREATE TABLE IF NOT EXISTS slots (
        slot_id SERIAL PRIMARY KEY,
        slot_number INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'available',
        location VARCHAR(255),
        department VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Get the highest slot_number that currently exists
    const currentMaxResult = await client.query(
      "SELECT COALESCE(MAX(slot_number), 0) AS max_slot FROM slots"
    );
    const currentMaxSlot = parseInt(currentMaxResult.rows[0].max_slot, 10);

    if (maxSlots > currentMaxSlot) {
      // Add new slots starting from currentMaxSlot + 1
      await client.query(
        `INSERT INTO slots (slot_number, status, location, department)
         SELECT 
           generate_series($1::integer + 1, $2::integer), 
           'available', 
           $3, 
           $4`,
        [currentMaxSlot, maxSlots, location, department]
      );
    } else if (maxSlots < currentMaxSlot) {
      // Mark excess slots as unavailable
      await client.query(
        `UPDATE slots 
         SET status = 'unavailable'
         WHERE slot_number > $1 AND status != 'booked'`,
        [maxSlots]
      );
    }

    // Update location and department for active slots
    await client.query(
      `UPDATE slots
       SET location = $1, department = $2
       WHERE slot_number <= $3 AND status != 'unavailable'`,
      [location, department, maxSlots]
    );
  } catch (err) {
    console.error('Error in updateSlots:', err);
    throw err;
  }
}


router.post('/', async (req, res) => {
  const { max_slots, location, department } = req.body;
  const client = await pool.connect();

  if (!max_slots || isNaN(max_slots)) {
    return res.status(400).json({ success: false, message: 'Invalid max_slots value' });
  }

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO slot_config (max_slots, location, department)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [max_slots, location, department]
    );

    await updateSlots(client, max_slots, location, department);

    await client.query('COMMIT');

    res.json({ success: true, ...result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating config:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to create configuration' });
  } finally {
    client.release();
  }
});


module.exports = router;