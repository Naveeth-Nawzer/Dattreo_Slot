
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

// exports.getConfig = async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT max_slots, location FROM slot_config WHERE config_id = 1`
//     );
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Configuration not found' 
//       });
//     }
    
//     res.json({ 
//       success: true,
//       max_slots: result.rows[0].max_slots,
//       location: result.rows[0].location || 'main'
//     });
//   } catch (err) {
//     console.error('Error fetching config:', err.message);
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to fetch configuration' 
//     });
//   }
// };

// exports.updateConfig = async (req, res) => {
//   const { max_slots, location } = req.body;

//   if (!max_slots || isNaN(max_slots) || max_slots < 1) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Invalid max_slots value' 
//     });
//   }

//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');

//     const result = await client.query(`
//       INSERT INTO slot_config (config_id, max_slots, location)
//       VALUES (1, $1, $2)
//       ON CONFLICT (config_id) 
//       DO UPDATE SET max_slots = EXCLUDED.max_slots, location = EXCLUDED.location
//       RETURNING max_slots, location
//     `, [max_slots, location || 'main']);

//     await resetSlots(max_slots);
//     await client.query('COMMIT');
    
//     res.json({ 
//       success: true, 
//       max_slots: result.rows[0].max_slots,
//       location: result.rows[0].location
//     });
//   } catch (err) {
//     await client.query('ROLLBACK');
//     res.status(500).json({ 
//       success: false,
//       message: 'Database error'
//     });
//   } finally {
//     client.release();
//   }
// };

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
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to fetch slots' 
//     });
//   }
// };

// exports.bookSlot = async (req, res) => {
//   const { id } = req.params;
//   const { user_id, location } = req.body;

//   if (!user_id) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Missing user_id' 
//     });
//   }
//   if (!location) {
//     return res.status(400).json({
//       success: false,
//       message: 'Missing location'
//     });
//   }

//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
    
//     const check = await client.query(
//       `SELECT id, status FROM slots WHERE id = $1 FOR UPDATE`,
//       [id]
//     );
    
//     if (check.rowCount === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Slot not found' 
//       });
//     }
    
//     const currentStatus = (check.rows[0].status || '').toLowerCase();
//     if (currentStatus !== 'available') {
//       await client.query('ROLLBACK');
//       return res.status(409).json({ 
//         success: false, 
//         message: 'Slot not available' 
//       });
//     }

//     const update = await client.query(
//       `UPDATE slots 
//        SET status = 'booked', user_id = $1, location = $3, booked_at = NOW()
//        WHERE id = $2 AND lower(status) = 'available'
//        RETURNING id, slot_number, status, user_id, location, booked_at`,
//       [user_id, id, location]
//     );

//     if (update.rowCount === 0) {
//       await client.query('ROLLBACK');
//       return res.status(409).json({
//         success: false,
//         message: 'Slot not available'
//       });
//     }
    
//     await client.query('COMMIT');
//     res.json({ 
//       success: true, 
//       message: 'Slot booked successfully',
//       slot: update.rows[0]
//     });
//   } catch (err) {
//     await client.query('ROLLBACK');
//     res.status(500).json({ 
//       success: false,
//       message: 'Failed to book slot' 
//     });
//   } finally {
//     client.release();
//   }
// };


const pool = require("../db/db");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Ensure qrcodes directory exists
const qrCodeDir = path.join(__dirname, "../public/qrcodes");
if (!fs.existsSync(qrCodeDir)) {
  fs.mkdirSync(qrCodeDir, { recursive: true });
}

// Helper: reset slots when config changes
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



// Or define it directly in the controller if you prefer:
async function resetSlots(maxSlots, location) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query('DELETE FROM slots');
    
    await client.query(
      `INSERT INTO slots (slot_number, status, location)
       SELECT generate_series(1, $1), 'available', $2`,
      [maxSlots, location]
    );
    
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

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

    // Update configuration
    const result = await client.query(`
      INSERT INTO slot_config (config_id, max_slots, location)
      VALUES (1, $1, $2)
      ON CONFLICT (config_id) 
      DO UPDATE SET max_slots = EXCLUDED.max_slots, location = EXCLUDED.location
      RETURNING max_slots, location
    `, [max_slots, location || 'Main Office']);

    // Reset slots with location
    await resetSlots(max_slots, location || 'Main Office');
    
    await client.query('COMMIT');
    
    res.json({ 
      success: true, 
      max_slots: result.rows[0].max_slots,
      location: result.rows[0].location
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Config update error:', err);
    
    let errorMessage = 'Failed to update configuration';
    if (err.code === '23502') { // Not null violation
      errorMessage = 'Database error: Missing required location value';
    } else if (err.code === '42P01') { // Table doesn't exist
      errorMessage = 'Database configuration error - missing table';
    }

    res.status(500).json({ 
      success: false,
      message: errorMessage,
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    client.release();
  }
};

exports.getConfig = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT max_slots, location FROM slot_config WHERE config_id = 1`
    );
    
    if (result.rows.length === 0) {
      // If no config exists, return defaults
      return res.json({ 
        success: true,
        max_slots: 20,
        location: 'Main Office'
      });
    }
    
    res.json({ 
      success: true,
      max_slots: result.rows[0].max_slots,
      location: result.rows[0].location
    });
  } catch (err) {
    console.error('Error fetching config:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch configuration',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// exports.updateConfig = async (req, res) => {
//   const { max_slots, location } = req.body;

//   if (!max_slots || isNaN(max_slots) || max_slots < 1) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Invalid max_slots value' 
//     });
//   }

//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');

//     const result = await client.query(`
//       INSERT INTO slot_config (config_id, max_slots, location)
//       VALUES (1, $1, $2)
//       ON CONFLICT (config_id) 
//       DO UPDATE SET max_slots = EXCLUDED.max_slots, location = EXCLUDED.location
//       RETURNING max_slots, location
//     `, [max_slots, location || 'main']);

//     await resetSlots(max_slots);
//     await client.query('COMMIT');
    
//     res.json({ 
//       success: true, 
//       max_slots: result.rows[0].max_slots,
//       location: result.rows[0].location
//     });
//   } catch (err) {
//     await client.query('ROLLBACK');
//     res.status(500).json({ 
//       success: false,
//       message: 'Database error'
//     });
//   } finally {
//     client.release();
//   }
// };


// exports.updateConfig = async (req, res) => {
//   const { max_slots, location } = req.body;

//   if (!max_slots || isNaN(max_slots) || max_slots < 1) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Invalid max_slots value' 
//     });
//   }

//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');

//     // First check if table exists (for better error handling)
//     try {
//       await client.query('SELECT 1 FROM slot_config LIMIT 1');
//     } catch (tableErr) {
//       if (tableErr.code === '42P01') { // Table doesn't exist
//         throw new Error('slot_config table does not exist');
//       }
//       throw tableErr;
//     }

//     // Update configuration
//     const result = await client.query(`
//       INSERT INTO slot_config (config_id, max_slots, location)
//       VALUES (1, $1, $2)
//       ON CONFLICT (config_id) 
//       DO UPDATE SET max_slots = EXCLUDED.max_slots, location = EXCLUDED.location
//       RETURNING max_slots, location
//     `, [max_slots, location || 'main']);

//     // Reset slots
//     await resetSlots(max_slots);
    
//     await client.query('COMMIT');
    
//     res.json({ 
//       success: true, 
//       max_slots: result.rows[0].max_slots,
//       location: result.rows[0].location
//     });
//   } catch (err) {
//     await client.query('ROLLBACK');
//     console.error('Config update error:', err.message);
    
//     let errorMessage = 'Failed to update configuration';
//     if (err.message.includes('table does not exist')) {
//       errorMessage = 'Database configuration error - missing table';
//     } else if (err.code === '23505') { // Unique violation
//       errorMessage = 'Configuration already exists';
//     }

//     res.status(500).json({ 
//       success: false,
//       message: errorMessage,
//       detail: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   } finally {
//     client.release();
//   }
// };



exports.getAllSlots = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        s.id, 
        s.slot_number, 
        s.status, 
        s.user_id,
        s.booked_at,
        s.qr_code_path,
        s.location as slot_location,
        p.name as patient_name,
        p.nic as patient_nic,
        p.number as patient_number,
        p.hospital as patient_hospital,
        p.department as patient_department
      FROM slots s
      LEFT JOIN patients p ON s.user_id = p.id
      ORDER BY s.slot_number ASC
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

// In your backend controller
exports.createBooking = async (req, res) => {
  try {
    // Destructure exactly what frontend sends
    const { name, nic, number, hospital, department, location, date, time, slot_id } = req.body;

    // Required fields validation
    const requiredFields = { name, nic, number, hospital, department, location };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // NIC validation
    if (nic.length < 10) {
      return res.status(400).json({
        success: false,
        error: "NIC must be at least 10 characters"
      });
    }

    // Phone validation
    if (!/^\d{10,15}$/.test(number)) {
      return res.status(400).json({
        success: false,
        error: "Phone must be 10-15 digits"
      });
    }

    // Rest of your booking logic...
    const result = await pool.query(
      `INSERT INTO patients 
       (name, nic, number, hospital, department, location) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, nic, number, hospital, department, location]
    );

    res.json({
      success: true,
      patient: result.rows[0]
    });

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({
      success: false,
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

exports.bookSlot = async (req, res) => {
  const { slotId } = req.params;
  const { user_id, location } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Validate inputs
    if (!user_id || !location) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: "User ID and location are required",
      });
    }

    // 1. Verify patient exists
    const patientCheck = await client.query(
      'SELECT id, nic FROM patients WHERE id = $1',
      [user_id]
    );

    if (patientCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: "Patient not found",
      });
    }

    // 2. Check and lock slot for update
    const slot = await client.query(
      `SELECT * FROM slots 
       WHERE id = $1 AND status = 'available'
       FOR UPDATE`,
      [slotId]
    );

    if (slot.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: "Slot not available",
      });
    }

    // 3. Update slot status
    const result = await client.query(
      `UPDATE slots 
       SET status = 'booked', 
           user_id = $1, 
           location = $2, 
           booked_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [user_id, location, slotId]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: "Slot booking failed",
      });
    }

    const bookedSlot = result.rows[0];

    // 4. Generate QR Code
    let qrCodeUrl = null;
    try {
      const qrData = {
        slotId: bookedSlot.id,
        slotNumber: bookedSlot.slot_number,
        patientId: user_id,
        patientNIC: patientCheck.rows[0].nic,
        bookedAt: bookedSlot.booked_at,
        location: bookedSlot.location,
        status: "booked",
      };

      const qrFilename = `slot_${bookedSlot.id}_${uuidv4()}.png`;
      const qrCodePath = path.join("qrcodes", qrFilename);
      const fullPath = path.join(qrCodeDir, qrFilename);

      await QRCode.toFile(fullPath, JSON.stringify(qrData), {
        color: { dark: "#000000", light: "#ffffff" },
        width: 300,
        errorCorrectionLevel: "H",
      });

      // Update slot with QR code path
      await client.query(
        "UPDATE slots SET qr_code_path = $1 WHERE id = $2",
        [qrCodePath, bookedSlot.id]
      );

      qrCodeUrl = `/qrcodes/${qrFilename}`;
    } catch (qrErr) {
      console.error("QR generation failed:", qrErr);
      // Don't fail the booking if QR generation fails
    }

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      slot: bookedSlot,
      qrCodeUrl,
      patient: patientCheck.rows[0],
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Slot booking error:", err.message);

    let errorMessage = "Server error during slot booking";
    if (err.code === '23503') {
      errorMessage = "Invalid patient reference";
    } else if (err.code === '23505') {
      errorMessage = "Slot already booked";
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  } finally {
    client.release();
  }
};

exports.cancelBooking = async (req, res) => {
  const { slotId } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check and lock slot for update
    const slot = await client.query(
      `SELECT * FROM slots 
       WHERE id = $1 AND status = 'booked'
       FOR UPDATE`,
      [slotId]
    );

    if (slot.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: "No active booking found for this slot",
      });
    }

    // Update slot status
    const result = await client.query(
      `UPDATE slots 
       SET status = 'available', 
           user_id = NULL, 
           booked_at = NULL,
           qr_code_path = NULL
       WHERE id = $1
       RETURNING *`,
      [slotId]
    );

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      slot: result.rows[0],
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Cancel booking error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to cancel booking",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  } finally {
    client.release();
  }
};