// require('dotenv').config();
// const express = require("express");
// const cors = require("cors");
// // const task = require("./routes/taskRoutes");
// const app = express();
// const PORT = 5001;
// const slot = require("./routes/SlotsRoutes");
// const bookingRoutes = require('./routes/BookingRoutes');
// const path = require('path');

// app.use(cors());
// app.use(express.json());
// // Serve generated QR codes
// app.use('/qrcodes', express.static(path.join(__dirname, 'public/qrcodes')));

// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });


// app.use("/api/slots", slot);
// app.use('/api', bookingRoutes);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001; // Use environment variable with fallback
const path = require('path');
const UserOperation = require('./Controllers/UserOperation');

// Routes
const slotRoutes = require("./routes/SlotsRoutes");
const bookingRoutes = require('./routes/BookingRoutes');

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*', // Configure allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Explicit allowed methods
  credentials: true // If using cookies/sessions
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/qrcodes', express.static(path.join(__dirname, 'public/qrcodes')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/slots", slotRoutes);
app.use('/api/bookings', bookingRoutes); // More specific than just '/api'
app.use('/UserOperation', UserOperation);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Optionally exit the process
  // process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optionally exit the process
  // process.exit(1);
});