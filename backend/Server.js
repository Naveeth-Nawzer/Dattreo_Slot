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



// require('dotenv').config();
// const express = require("express");
// const cors = require("cors");
// const app = express();
// const PORT = process.env.PORT || 5001; // Use environment variable with fallback
// const path = require('path');
// const slotRoutes = require("./routes/SlotsRoutes");
// const bookingRoutes = require('./routes/BookingRoutes');

// app.use(express.json());

// const allowedOrigins = ['http://localhost:5173'];



// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));

// // Handle preflight requests
// app.options('*', cors(corsOptions));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static files
// app.use('/qrcodes', express.static(path.join(__dirname, 'public/qrcodes')));

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.status(200).json({ 
//     status: 'healthy',
//     timestamp: new Date().toISOString()
//   });
// });

// // Routes


// // API Routes
// app.use("/api/slots", slotRoutes);
// app.use('/api/bookings', bookingRoutes); // More specific than just '/api'

// // 404 Handler
// app.use((req, res, next) => {
//   res.status(404).json({
//     success: false,
//     message: `Route not found: ${req.originalUrl}`
//   });
// });

// // Error Handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Internal Server Error',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // Server start
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.error('Unhandled Rejection:', err);
//   // Optionally exit the process
//   // process.exit(1);
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.error('Uncaught Exception:', err);
//   // Optionally exit the process
//   // process.exit(1);
// });


// const express = require('express');
// const cors = require('cors');
// const app = express();
// const PORT = process.env.PORT || 5001;
// const bookingRoutes = require('./routes/BookingRoutes');

// app.use(cors({
//   origin: 'http://localhost:5173', // Your frontend origin
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Handle preflight requests
// app.options('*', cors());

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control'],
//   optionsSuccessStatus: 200
// };

// // Middleware
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Health Check
// app.get('/api/health', (req, res) => {
//   res.status(200).json({ status: 'healthy' });
// });

// // Routes
// const slotsRoutes = require('./routes/SlotsRoutes');
// app.use('/api/slots', slotsRoutes);


// app.use('/api/bookings', bookingRoutes); // More specific than just '/api'

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     error: 'Internal Server Error',
//     message: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
// });

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173', // Your frontend origin
  // Add other allowed origins here if needed
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Routes
const slotsRoutes = require('./routes/SlotsRoutes');
const bookingRoutes = require('./routes/BookingRoutes');
const UserOperation = require('./Controllers/UserOperation');

app.use('/api/slots', slotsRoutes);


app.use('/api/bookings', bookingRoutes); // More specific than just '/api'
app.use('/UserOperation', UserOperation);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});