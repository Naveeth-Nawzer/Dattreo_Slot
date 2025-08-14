// const pool = require("../db/db");
// const { body, validationResult } = require('express-validator');

// // Validation middleware
// const validateFirstVisit = [
//   body('name')
//     .trim()
//     .notEmpty().withMessage('Name is required')
//     .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3-50 characters'),
  
//   body('nic')
//     .trim()
//     .notEmpty().withMessage('NIC is required')
//     .custom(value => {
//       // Validate Sri Lankan NIC (old 10-digit or new 12-digit format)
//       const oldNicPattern = /^[0-9]{9}[vVxX]$/;
//       const newNicPattern = /^[0-9]{12}$/;
//       if (!oldNicPattern.test(value) && !newNicPattern.test(value)) {
//         throw new Error('Please enter a valid NIC number');
//       }
//       return true;
//     }),
  
//   body('contact')
//     .trim()
//     .notEmpty().withMessage('Contact is required')
//     .custom(value => {
//       // Validate email or Sri Lankan mobile number
//       const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       const mobilePattern = /^0[1-9][0-9]{8}$/;
//       if (!emailPattern.test(value) && !mobilePattern.test(value)) {
//         throw new Error('Please enter a valid email or mobile number (e.g., 0771234567)');
//       }
//       return true;
//     }),
  
//   body('passcode')
//     .trim()
//     .notEmpty().withMessage('Passcode is required')
//     .isLength({ min: 6 }).withMessage('Passcode must be at least 6 digits')
//     .isNumeric().withMessage('Passcode must contain only numbers')
//     .matches(/^[0-9]+$/).withMessage('Passcode must be numeric only')
// ];

// // Route handler with validation
// router.post("/", validateFirstVisit, async (req, res) => {
//   try {
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, nic, contact, passcode } = req.body;

//     // Check if NIC already exists
//     const existingVisit = await pool.query(
//       'SELECT * FROM first_visits WHERE nic = $1',
//       [nic]
//     );

//     if (existingVisit.rows.length > 0) {
//       return res.status(409).json({ error: 'This NIC is already registered' });
//     }

//     const query = `
//       INSERT INTO first_visits (name, nic, contact, passcode)
//       VALUES ($1, $2, $3, $4)
//       RETURNING id, name, nic, contact, created_at;
//     `;
//     const values = [name, nic, contact, hashedPasscode];

//     const result = await pool.query(query, values);
    
//     res.status(201).json({ 
//       message: "First Visit booked successfully!", 
//       data: result.rows[0] 
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ 
//       error: "Server error",
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // GET endpoint to verify passcode (for the continue with passcode flow)
// router.post("/verify-passcode", async (req, res) => {
//   try {
//     const { nic, passcode } = req.body;

//     if (!nic || !passcode) {
//       return res.status(400).json({ error: "NIC and passcode are required" });
//     }

//     // Find user by NIC
//     const user = await pool.query(
//       'SELECT * FROM first_visits WHERE nic = $1',
//       [nic]
//     );

//     if (user.rows.length === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }


//     if (!isValid) {
//       return res.status(401).json({ error: "Invalid passcode" });
//     }

//     // Return user data (excluding sensitive information)
//     const { passcode: _, ...userData } = user.rows[0];
//     res.status(200).json({ 
//       message: "Passcode verified successfully",
//       user: userData
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ 
//       error: "Server error",
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// module.exports = router;






const express = require('express');
const router = express.Router();
const pool = require("../db/db");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Login validation
const validateLogin = [
  body('nic')
    .trim()
    .notEmpty().withMessage('NIC is required')
    .custom(value => {
      const oldNicPattern = /^[0-9]{9}[vVxX]$/;
      const newNicPattern = /^[0-9]{12}$/;
      if (!oldNicPattern.test(value) && !newNicPattern.test(value)) {
        throw new Error('Please enter a valid NIC number');
      }
      return true;
    }),
  
  body('passcode')
    .trim()
    .notEmpty().withMessage('Passcode is required')
    .isLength({ min: 6 }).withMessage('Passcode must be at least 6 digits')
    .isNumeric().withMessage('Passcode must contain only numbers')
];

// Login endpoint with bcrypt
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nic, passcode } = req.body;

    // 1. Check if user exists
    const userQuery = await pool.query(
      'SELECT id, name, nic, passcode FROM users WHERE nic = $1',
      [nic]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    const user = userQuery.rows[0];

    const isMatch = await bcrypt.compare(passcode, user.passcode);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid passcode" 
      });
    }

    // 3. Login successful - return user data (without sensitive info)
    const { passcode: _, ...userData } = user;
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during login",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Registration endpoint (using your existing validateFirstVisit)
router.post('/register', async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, nic, emailOrMobile, passcode } = req.body;

    // Check if NIC already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE nic = $1',
      [nic]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        success: false,
        error: 'This NIC is already registered' 
      });
    }

    const hashedPasscode = await bcrypt.hash(passcode, 10);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, nic, emailOrMobile, passcode)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, nic, emailOrMobile`,
      [name, nic, emailOrMobile, hashedPasscode]
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during registration",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;