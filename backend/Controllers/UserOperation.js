const express = require('express');
const router = express.Router();
const pool = require("../db/db");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jabashjhshdshvasjbsdjds'; 
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


router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userQuery = await pool.query(
      'SELECT id, name, nic FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userQuery.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ user: userQuery.rows[0] });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nic, passcode } = req.body;

    const userQuery = await pool.query(
      'SELECT id, name, nic, passcode FROM users WHERE nic = $1',
      [nic]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const user = userQuery.rows[0];
    const isMatch = await bcrypt.compare(passcode, user.passcode); // use plain compare if not hashed

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid passcode" });
    }

    const { passcode: _, ...userData } = user;
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, message: "Login successful", user: userData, token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Server error during login" });
  }
});

// Registration endpoint (using your existing validateFirstVisit)
router.post('/register', async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, nic, emailormobile, passcode } = req.body;

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

    // Hash the password with bcrypt
    const saltRounds = 10;
    const hashedPasscode = await bcrypt.hash(passcode, saltRounds);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, nic, emailormobile, passcode)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, nic, emailormobile`,
      [name, nic, emailormobile, hashedPasscode]
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


// Update Profile validation
const validateUpdateProfile = [
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
  
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  
  body('emailOrMobile')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please enter a valid mobile number or email'),
];

// Update Profile endpoint
router.put('/updateProfile', validateUpdateProfile, async (req, res) => {
  try {
    const { nic, name, emailOrMobile } = req.body;

    // const result = await pool.query(
    //   `UPDATE users 
    //    SET name = $1, 
    //        emailOrMobile = $2,
    //        updated_at = NOW()
    //    WHERE nic = $3
    //    RETURNING id, name, nic, emailOrMobile`,
    //   [name, emailOrMobile, nic]
    // );

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 1. Check if user exists
    const userQuery = await pool.query(
      'SELECT id FROM users WHERE nic = $1',
      [nic]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    // 2. Update user profile
    const updateQuery = `
      UPDATE users 
      SET name = $1, 
          emailOrMobile = COALESCE($2, emailOrMobile),
          updated_at = NOW()
      WHERE nic = $4
      RETURNING id, name, nic, emailOrMobile
    `;

    const result = await pool.query(updateQuery, [name, emailOrMobile, nic]);

    if (result.rowCount === 1) {
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: result.rows[0]
      });
    } else {
      throw new Error('Failed to update profile');
    }

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during profile update",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add this to your existing routes file
// router.get('/profile/:nic', async (req, res) => {
//   try {
//     const { nic } = req.params;

//     await pool.query('SELECT 1');

//     // Get user profile (excluding sensitive data like passcode)
//     const result = await pool.query(
//       'SELECT id, name, nic, emailOrMobile FROM users WHERE nic = $1',
//       [nic]
//     );

//     const userData = result.rows[0];

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "User not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user: {
//         id: user.id,
//         name: user.name,
//         nic: user.nic,
//         emailOrMobile: user.emailormobile || ""
//       }
//     });

//   } catch (error) {
//     console.error("Profile fetch error:", error);
//     res.status(500).json({
//       success: false,
//       error: "Server error while fetching profile",
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// In UserOperation.js - Fix the profile endpoint
router.get('/profile/:nic', async (req, res) => {
  try {
    const { nic } = req.params;

    // Get user data from database
    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        nic, 
        emailormobile as "emailOrMobile"
       FROM users 
       WHERE nic = $1`,
      [nic]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Use result.rows[0] instead of undefined 'user' variable
    const userData = result.rows[0];
    
    res.status(200).json({
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        nic: userData.nic,
        emailOrMobile: userData.emailOrMobile || ""
      }
    });

  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching profile",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});



module.exports = router;