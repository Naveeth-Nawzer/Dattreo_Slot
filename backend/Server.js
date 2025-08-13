require('dotenv').config();
const express = require("express");
const cors = require("cors");
// const task = require("./routes/taskRoutes");
const app = express();
const PORT = 5001;
const slot = require("./routes/SlotsRoutes");
const bookingRoutes = require('./routes/BookingRoutes');
const path = require('path');

app.use(cors());
app.use(express.json());
// Serve generated QR codes
app.use('/qrcodes', express.static(path.join(__dirname, 'public/qrcodes')));

app.get('/', (req, res) => {
  res.send('Server is running!');
});


app.use("/api/slots", slot);
app.use('/api', bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
