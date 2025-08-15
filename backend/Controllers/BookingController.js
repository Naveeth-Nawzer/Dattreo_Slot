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

/**
 * Get appointments for a patient
 */
exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Validate input
    if (!patientId) {
      return res.status(400).json({
        error: "Patient ID is required",
      });
    }

    // Query to get appointments with slot details
    const result = await pool.query(
      `SELECT 
        p.name, 
        p.nic, 
        p.number AS mobile,
        p.hospital,
        p.department,
        s.date_time,
        s.location,
        s.qr_code_path,
        s.status
      FROM slots s
      JOIN patients p ON s.user_id = p.id
      WHERE p._id = $1
      ORDER BY s.date_time DESC`,
      [patientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found for this patient",
      });
    }

    // Format the data for frontend
    const appointments = result.rows.map(row => ({
      name: row.name,
      nic: row.nic,
      mobile: row.mobile,
      hospital: row.hospital,
      department: row.department,
      date: new Date(row.date_time).toLocaleDateString('en-GB'), // DD-MM-YYYY format
      time: formatTimeSlot(row.date_time), // You'll need to implement this
      location: row.location,
      status: row.status,
      qrCodeUrl: row.qr_code_path
    }));

    res.status(200).json({
      success: true,
      appointments
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Helper function to format time slot
function formatTimeSlot(dateTime) {
  const date = new Date(dateTime);
  const startTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  
  // Assuming 15-minute slots
  const endTime = new Date(date.getTime() + 15 * 60000).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });
  
  return `${startTime} - ${endTime}`;
}

/**
 * Get all patients
 */
exports.getAllPatients = async (req, res) => {
  try {
    // Query to get all patients with optional pagination
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        id,
        name,
        nic,
        number AS mobile,
        hospital,
        department,
        location,
        booking_status,
        created_at
      FROM patients
    `;

    let queryParams = [];
    let whereClauses = [];

    // Add search filter if provided
    if (search) {
      whereClauses.push(`
        (name ILIKE $${queryParams.length + 1} OR 
        nic ILIKE $${queryParams.length + 1} OR 
        number ILIKE $${queryParams.length + 1})
      `);
      queryParams.push(`%${search}%`);
    }

    // Add WHERE clause if needed
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    // Add sorting and pagination
    query += `
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1}
      OFFSET $${queryParams.length + 2}
    `;
    queryParams.push(limit, offset);

    // Execute query
    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM patients';
    if (whereClauses.length > 0) {
      countQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].count, 10);

    // Format response
    const patients = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      nic: row.nic,
      mobile: row.mobile,
      hospital: row.hospital,
      department: row.department,
      location: row.location,
      status: row.booking_status,
      createdAt: row.created_at,
      formattedDate: new Date(row.created_at).toLocaleDateString('en-GB')
    }));

    res.status(200).json({
      success: true,
      patients,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    console.error('Error fetching patients:', err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch patients",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};
/**
 * Get all patient appointments
 */
exports.getAllPatientAppointments = async (req, res) => {
  try {
    // Query to get all appointments with patient and slot details
    const result = await pool.query(
      `SELECT 
        p.id AS patient_id,
        p.name, 
        p.nic, 
        p.number AS mobile,
        p.hospital,
        p.department,
        s.booked_at AS date_time,
        s.location,
        s.qr_code_path,
        s.status
      FROM slots s
      JOIN patients p ON s.user_id = p.id
      WHERE s.status = 'booked'
      ORDER BY date_time DESC`
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        appointments: [],
        message: "No appointments found"
      });
    }

    // Format the data for frontend
    const appointments = result.rows.map(row => ({
      patientId: row.patient_id,
      name: row.name,
      nic: row.nic,
      mobile: row.mobile,
      hospital: row.hospital,
      department: row.department,
      date: new Date(row.date_time).toLocaleDateString('en-GB'), // DD-MM-YYYY format
      time: formatTimeSlot(row.date_time),
      location: row.location,
      status: row.status,
      qrCodeUrl: row.qr_code_path
    }));

    res.status(200).json({
      success: true,
      appointments
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// In your backend controller
exports.getPatientAppointments = async (req, res) => {
  try {
    const { nic } = req.query;
    
    if (!nic) {
      return res.status(400).json({
        success: false,
        error: "NIC parameter is required"
      });
    }

    // Query patients table directly since no bookings table exists
    const query = `
      SELECT 
        id AS patient_id,
        name, 
        nic, 
        number AS mobile,
        hospital,
        department,
        created_at AS appointment_date,
        location,
        booking_status
      FROM patients
      WHERE nic = $1
      ORDER BY created_at DESC
    `;
    
    const { rows } = await pool.query(query, [nic]);
    
    if (rows.length === 0) {
      return res.json({
        success: true,
        message: "No appointments found for this NIC",
        appointments: []
      });
    }
    
    // Format as appointments
    const appointments = rows.map(row => ({
      ...row,
      booking_date: row.appointment_date,
      booking_status: row.status
    }));

    res.json({
      success: true,
      appointments
    });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch appointments",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};