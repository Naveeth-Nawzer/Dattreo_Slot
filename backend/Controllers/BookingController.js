const pool = require("../db/db");

exports.createBooking = async (req, res) => {
  try {
    const { name, NIC, number, hospital, department, location } = req.body;

    // Validate required fields (added location to validation)
    if (!name || !NIC || !number || !hospital || !department || !location) {
      return res.status(400).json({ 
        error: 'All fields are required: name, NIC, number, hospital, department, and location' 
      });
    }

    // Validate NIC format
    if (NIC.length < 10) {
      return res.status(400).json({ 
        error: 'NIC must be at least 10 characters long' 
      });
    }

    // Validate phone number format
    if (number.length < 10) {
      return res.status(400).json({ 
        error: 'Phone number must be at least 10 digits' 
      });
    }

    // Check for existing NIC
    const existingPatient = await pool.query(
      'SELECT * FROM patients WHERE NIC = $1', 
      [NIC]
    );

    if (existingPatient.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Patient already exists',
        patient: existingPatient.rows[0]
      });
    }

    // Insert new booking with location
    const result = await pool.query(
      `INSERT INTO patients 
       (name, NIC, number, hospital, department, location) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, NIC, number, hospital, department, location]
    );

    // Successful response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      patient: result.rows[0]
    });
    
  } catch (err) {
    console.error(err.message);
    
    // Handle duplicate NIC error specifically
    if (err.code === '23505') {
      return res.status(200).json({
        success: true,
        message: 'Patient already exists',
        // When unique violation happens, we don't have the row; client should retry fetch by NIC in real system
      });
    }
    
    res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


exports.bookSlot = async (req, res) => {
    try {
      const { slotId } = req.params;
      const { user_id, location } = req.body;
  
      // Validate input
      if (!user_id || !location) {
        return res.status(400).json({ 
          error: 'User ID and location are required' 
        });
      }
  
      // Check slot availability
      const slot = await pool.query(
        "SELECT * FROM slots WHERE id = $1 AND status = 'available'",
        [slotId]
      );
  
      if (slot.rows.length === 0) {
        return res.status(400).json({ 
          error: 'Slot not available' 
        });
      }
  
      // Book the slot
      const result = await pool.query(
        `UPDATE slots 
         SET status = 'booked', 
             user_id = $1, 
             location = $2,
             booked_at = NOW()
         WHERE id = $3 AND lower(status) = 'available'
         RETURNING *`,
        [user_id, location, slotId]
      );
  
      if (result.rows.length === 0) {
        return res.status(409).json({ success: false, error: 'Slot not available' });
      }

      res.status(200).json({
        success: true,
        slot: result.rows[0]
      });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ 
        error: 'Server error during slot booking',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };
