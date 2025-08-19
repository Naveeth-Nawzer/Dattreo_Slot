const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5001;
const JWT_SECRET = 'jabashjhshdshvasjbsdjds';

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
app.use('/qrcodes', express.static(path.join(__dirname, 'public/qrcodes')));


// Routes
const slotsRoutes = require('./routes/SlotsRoutes');
const bookingRoutes = require('./routes/BookingRoutes');
const UserOperation = require('./Controllers/UserOperation');
const slotConfigRoutes = require('./Controllers/slotconfig');

app.use('/api/slots', slotsRoutes);
app.use('/api/slotsconfig', slotConfigRoutes);


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