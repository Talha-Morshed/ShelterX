const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const facilityRoutes = require('./routes/facilityRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const facilityServiceRoutes = require('./routes/facilityServiceRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const donationRoutes = require('./routes/donationRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const emergencyContactRoutes = require('./routes/emergencyContactRoutes');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'ShelterX API is running' });
});

app.use('/api/facilities', facilityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/facility-services', facilityServiceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/emergency-contacts', emergencyContactRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
