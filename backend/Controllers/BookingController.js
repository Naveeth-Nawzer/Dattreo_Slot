// const pool = require("../db/db");

// exports.createBooking = async (req, res) => {
//   try {
//     const { name, NIC, number, hospital, department, location } = req.body;

//     // Validate required fields (added location to validation)
//     if (!name || !NIC || !number || !hospital || !department || !location) {
//       return res.status(400).json({ 
//         error: 'All fields are required: name, NIC, number, hospital, department, and location' 
//       });
//     }

//     // Validate NIC format
//     if (NIC.length < 10) {
//       return res.status(400).json({ 
//         error: 'NIC must be at least 10 characters long' 
//       });
//     }

//     // Validate phone number format
//     if (number.length < 10) {
//       return res.status(400).json({ 
//         error: 'Phone number must be at least 10 digits' 
//       });
//     }

//     // Check for existing NIC
//     const existingPatient = await pool.query(
//       'SELECT * FROM patients WHERE NIC = $1', 
//       [NIC]
//     );

//     if (existingPatient.rows.length > 0) {
//       return res.status(200).json({
//         success: true,
//         message: 'Patient already exists',
//         patient: existingPatient.rows[0]
//       });
//     }

//     // Insert new booking with location
//     const result = await pool.query(
//       `INSERT INTO patients 
//        (name, NIC, number, hospital, department, location) 
//        VALUES ($1, $2, $3, $4, $5, $6) 
//        RETURNING *`,
//       [name, NIC, number, hospital, department, location]
//     );

//     // Successful response
//     res.status(201).json({
//       success: true,
//       message: 'Booking created successfully',
//       patient: result.rows[0]
//     });
    
//   } catch (err) {
//     console.error(err.message);
    
//     // Handle duplicate NIC error specifically
//     if (err.code === '23505') {
//       return res.status(200).json({
//         success: true,
//         message: 'Patient already exists',
//         // When unique violation happens, we don't have the row; client should retry fetch by NIC in real system
//       });
//     }
    
//     res.status(500).json({ 
//       error: 'Server error',
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };


// exports.bookSlot = async (req, res) => {
//     try {
//       const { slotId } = req.params;
//       const { user_id, location } = req.body;
  
//       // Validate input
//       if (!user_id || !location) {
//         return res.status(400).json({ 
//           error: 'User ID and location are required' 
//         });
//       }
  
//       // Check slot availability
//       const slot = await pool.query(
//         "SELECT * FROM slots WHERE id = $1 AND status = 'available'",
//         [slotId]
//       );
  
//       if (slot.rows.length === 0) {
//         return res.status(400).json({ 
//           error: 'Slot not available' 
//         });
//       }
  
//       // Book the slot
//       const result = await pool.query(
//         `UPDATE slots 
//          SET status = 'booked', 
//              user_id = $1, 
//              location = $2,
//              booked_at = NOW()
//          WHERE id = $3 AND lower(status) = 'available'
//          RETURNING *`,
//         [user_id, location, slotId]
//       );
  
//       if (result.rows.length === 0) {
//         return res.status(409).json({ success: false, error: 'Slot not available' });
//       }

//       res.status(200).json({
//         success: true,
//         slot: result.rows[0]
//       });
  
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).json({ 
//         error: 'Server error during slot booking',
//         details: process.env.NODE_ENV === 'development' ? err.message : undefined
//       });
//     }
//   };

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

/**
 * Create a new booking (patient record)
 */
exports.createBooking = async (req, res) => {
  try {
    const { name, NIC, number, hospital, department, location } = req.body;

    // Validate required fields
    if (!name || !NIC || !number || !hospital || !department || !location) {
      return res.status(400).json({
        error:
          "All fields are required: name, NIC, number, hospital, department, and location",
      });
    }

    // NIC length check
    if (NIC.length < 10) {
      return res.status(400).json({
        error: "NIC must be at least 10 characters long",
      });
    }

    // Phone number check
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(number)) {
      return res.status(400).json({
        error: "Phone number must be 10-15 digits",
      });
    }

    // Check if patient exists
    const existingPatient = await pool.query(
      "SELECT * FROM patients WHERE NIC = $1",
      [NIC]
    );

    if (existingPatient.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Patient already exists",
        patient: existingPatient.rows[0],
      });
    }
    // In your createBooking function
if (existingPatient.rows.length > 0) {
  // Make sure to return ALL needed fields including id
  const patient = existingPatient.rows[0];
  return res.status(200).json({
    success: true,
    message: "Patient already exists",
    patient: {
      id: patient.id, // Ensure this matches slots.user_id type
      name: patient.name,
      NIC: patient.nic, // Note case sensitivity
      number: patient.number,
      hospital: patient.hospital,
      department: patient.department,
      location: patient.location
    }
  });
}

    // Insert patient
    const result = await pool.query(
      `INSERT INTO patients 
        (name, NIC, number, hospital, department, location, booking_status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'confirmed') 
       RETURNING *`,
      [name, NIC, number, hospital, department, location]
    );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      patient: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: "Server error",
      details:
        process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * Book a slot
 */
exports.bookSlot = async (req, res) => {
  const { slotId } = req.params;
  const { user_id, location } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    console.log("📥 Slot booking request body:", req.body);

    // Validate inputs
    if (!user_id || !location) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: "User ID and location are required",
      });
    }

    // 1. Verify patient exists (foreign key check)
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
       FOR UPDATE`, // Lock the row
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
        patientId: user_id,
        patientNIC: patientCheck.rows[0].nic,
        dateTime: bookedSlot.date_time || new Date().toISOString(),
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

    await client.query('COMMIT'); // Commit transaction

    res.status(200).json({
      success: true,
      slot: bookedSlot,
      qrCodeUrl,
      patient: patientCheck.rows[0], // Include patient details
    });

  } catch (err) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error("Slot booking error:", err.message);

    // Handle specific error cases
    let errorMessage = "Server error during slot booking";
    if (err.code === '23503') { // Foreign key violation
      errorMessage = "Invalid patient reference";
    } else if (err.code === '23505') { // Unique violation
      errorMessage = "Slot already booked";
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  } finally {
    client.release(); // Release client back to pool
  }
};