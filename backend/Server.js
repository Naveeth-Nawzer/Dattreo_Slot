require('dotenv').config();
const express = require("express");
const cors = require("cors");
// const task = require("./routes/taskRoutes");
const app = express();
const PORT = 5001;
const slot = require("./routes/SlotsRoutes");
const bookingRoutes = require('./routes/BookingRoutes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});


app.use("/api/slots", slot);
app.use('/api', bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
