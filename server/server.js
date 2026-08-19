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

// ---- TEMPORARY: JOIN demo endpoint (remove after viva) ----
const db = require('./config/db');

const joinQueries = {
  'Q1_INNER_donations_with_names': `
    SELECT d.donation_id, d.amount, d.donation_type, u.full_name AS donor_name, f.facility_name
    FROM donations d
    INNER JOIN users u ON d.user_id = u.user_id
    INNER JOIN facilities f ON d.facility_id = f.facility_id
    ORDER BY d.donation_id DESC
  `,
  'Q2_INNER_reviews_with_names': `
    SELECT r.review_id, r.rating, r.comment, u.full_name AS reviewer, f.facility_name
    FROM reviews r
    INNER JOIN users u ON r.user_id = u.user_id
    INNER JOIN facilities f ON r.facility_id = f.facility_id
    ORDER BY r.review_id DESC
  `,
  'Q3_INNER_services_at_facilities': `
    SELECT f.facility_name, s.service_name, s.category, fs.is_available
    FROM facility_services fs
    INNER JOIN facilities f ON fs.facility_id = f.facility_id
    INNER JOIN services s ON fs.service_id = s.service_id
    ORDER BY f.facility_name, s.service_name
  `,
  'Q4_LEFT_facilities_with_reviews': `
    SELECT f.facility_name, f.city, r.review_id, r.rating, r.comment
    FROM facilities f
    LEFT JOIN reviews r ON f.facility_id = r.facility_id
    ORDER BY f.facility_name
  `,
  'Q5_LEFT_users_with_donations': `
    SELECT u.full_name, u.email, d.donation_id, d.amount, d.donation_type
    FROM users u
    LEFT JOIN donations d ON u.user_id = d.user_id
    ORDER BY u.full_name
  `,
  'Q6_LEFT_facilities_volunteer_count': `
    SELECT f.facility_name, f.city, COUNT(v.volunteer_id) AS volunteer_count
    FROM facilities f
    LEFT JOIN volunteers v ON f.facility_id = v.facility_id
    GROUP BY f.facility_id, f.facility_name, f.city
    ORDER BY volunteer_count DESC
  `,
  'Q7_RIGHT_users_with_reviews': `
    SELECT u.full_name, u.email, r.review_id, r.rating
    FROM reviews r
    RIGHT JOIN users u ON r.user_id = u.user_id
    ORDER BY u.full_name
  `,
  'Q8_FULL_users_and_reviews': `
    SELECT u.user_id, u.full_name, r.review_id, r.rating
    FROM users u
    LEFT JOIN reviews r ON u.user_id = r.user_id
    UNION
    SELECT u.user_id, u.full_name, r.review_id, r.rating
    FROM users u
    RIGHT JOIN reviews r ON u.user_id = r.user_id
    ORDER BY user_id
  `,
  'Q9_FULL_facilities_and_donations': `
    SELECT f.facility_id, f.facility_name, d.donation_id, d.amount
    FROM facilities f
    LEFT JOIN donations d ON f.facility_id = d.facility_id
    UNION
    SELECT f.facility_id, f.facility_name, d.donation_id, d.amount
    FROM facilities f
    RIGHT JOIN donations d ON f.facility_id = d.facility_id
    ORDER BY facility_id
  `,
  'BONUS_facility_dashboard': `
    SELECT f.facility_name, f.city, f.capacity,
           COALESCE(SUM(d.amount), 0) AS total_donations,
           ROUND(AVG(r.rating), 1) AS avg_rating,
           COUNT(DISTINCT v.volunteer_id) AS volunteer_count
    FROM facilities f
    LEFT JOIN donations d ON f.facility_id = d.facility_id
    LEFT JOIN reviews r ON f.facility_id = r.facility_id
    LEFT JOIN volunteers v ON f.facility_id = v.facility_id
    GROUP BY f.facility_id, f.facility_name, f.city, f.capacity
    ORDER BY total_donations DESC
  `
};

app.get('/api/joins', async (req, res) => {
  try {
    const results = {};
    for (const [name, sql] of Object.entries(joinQueries)) {
      const [rows] = await db.execute(sql);
      results[name] = rows;
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ---- END JOIN demo ----

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
