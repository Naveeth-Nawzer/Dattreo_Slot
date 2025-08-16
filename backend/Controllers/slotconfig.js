const express = require('express');
const router = express.Router();
const pool = require('../db/db');
//const { validateConfig } = require('../middleware/validation');

// Get all configurations
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM slot_config ORDER BY config_id`
    );
    
    res.json({ 
      success: true,
      configurations: result.rows 
    });
  } catch (err) {
    console.error('Error fetching all configs:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch configurations'
    });
  }
});

// Get current configuration
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM slot_config WHERE config_id = 1`
    );
    
    if (result.rows.length === 0) {
      // Return default config if none exists
      return res.json({ 
        success: true,
        max_slots: 20,
        location: 'Main Office',
        department: 'General'
      });
    }
    
    res.json({ 
      success: true,
      ...result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching config:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch configuration'
    });
  }
});

// Create new configuration
router.post('/', async (req, res) => {
  const { max_slots, location, department } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO slot_config (config_id, max_slots, location, department)
       VALUES (1, $1, $2, $3)
       ON CONFLICT (config_id) 
       DO UPDATE SET 
         max_slots = EXCLUDED.max_slots,
         location = EXCLUDED.location,
         department = EXCLUDED.department
       RETURNING *`,
      [max_slots, location, department]
    );

    // Reset all slots with new configuration
    await resetSlots(client, max_slots, location, department);

    await client.query('COMMIT');
    
    res.json({ 
      success: true,
      ...result.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating config:', err);
    
    let errorMessage = 'Failed to create configuration';
    if (err.code === '23505') {
      errorMessage = 'Configuration already exists';
    }

    res.status(500).json({ 
      success: false,
      message: errorMessage
    });
  } finally {
    client.release();
  }
});

// Update configuration
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { max_slots, location, department } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE slot_config 
       SET max_slots = $1,
           location = $2,
           department = $3
       WHERE config_id = $4
       RETURNING *`,
      [max_slots, location, department, id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        success: false,
        message: 'Configuration not found'
      });
    }

    // Reset all slots with new configuration
    await resetSlots(client, max_slots, location, department);

    await client.query('COMMIT');
    
    res.json({ 
      success: true,
      ...result.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating config:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update configuration'
    });
  } finally {
    client.release();
  }
});

// Delete configuration
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

// Helper function to reset slots
async function resetSlots(client, maxSlots, location, department) {
  await client.query('DELETE FROM slots');
  
  await client.query(
    `INSERT INTO slots (slot_number, status, location, department)
     SELECT generate_series(1, $1), 'available', $2, $3`,
    [maxSlots, location, department]
  );
}

module.exports = router;