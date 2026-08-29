const db = require('../config/db');

const getAllDonations = async () => {
  const [rows] = await db.execute(
    `SELECT d.*, u.full_name, f.facility_name
     FROM donations d
     JOIN users u ON d.user_id = u.user_id
     JOIN facilities f ON d.facility_id = f.facility_id
     ORDER BY d.donation_id DESC`
  );
  return rows;
};

const getDonationsByFacility = async (facilityId) => {
  const [rows] = await db.execute(
    `SELECT d.*, u.full_name
     FROM donations d
     JOIN users u ON d.user_id = u.user_id
     WHERE d.facility_id = ?`,
    [facilityId]
  );
  return rows;
};

const getDonationById = async (donationId) => {
  const [rows] = await db.execute(
    'SELECT * FROM donations WHERE donation_id = ?',
    [donationId]
  );
  return rows[0] || null;
};

const createDonation = async (donationData) => {
  const { facility_id, user_id, amount, donation_type, notes } = donationData;
  const [result] = await db.execute(
    `INSERT INTO donations (facility_id, user_id, amount, donation_type, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [facility_id, user_id, amount, donation_type || 'money', notes || null]
  );
  return result.insertId;
};

const updateDonation = async (donationId, donationData) => {
  const { facility_id, user_id, amount, donation_type, notes } = donationData;
  const [result] = await db.execute(
    `UPDATE donations SET
      facility_id = ?,
      user_id = ?,
      amount = ?,
      donation_type = ?,
      notes = ?
    WHERE donation_id = ?`,
    [facility_id, user_id, amount, donation_type || 'money', notes || null, donationId]
  );
  return result.affectedRows;
};

const deleteDonation = async (donationId) => {
  const [result] = await db.execute(
    'DELETE FROM donations WHERE donation_id = ?',
    [donationId]
  );
  return result.affectedRows;
};

const getFacilitiesAndDonations = async () => {
  const [rows] = await db.execute(
    `SELECT f.facility_id, f.facility_name, f.city,
            d.donation_id, d.amount, d.donation_type, d.notes
     FROM facilities f
     LEFT JOIN donations d ON f.facility_id = d.facility_id
     UNION
     SELECT f.facility_id, f.facility_name, f.city,
            d.donation_id, d.amount, d.donation_type, d.notes
     FROM facilities f
     RIGHT JOIN donations d ON f.facility_id = d.facility_id
     ORDER BY facility_id`
  );
  return rows;
};

// A- SUM aggregate: total donations per facility
const getFacilityDonationTotals = async () => {
  const [rows] = await db.execute(
    `SELECT f.facility_id, f.facility_name, f.city,
            COALESCE(SUM(d.amount), 0) AS total_donations
     FROM facilities f
     LEFT JOIN donations d ON f.facility_id = d.facility_id
     GROUP BY f.facility_id, f.facility_name, f.city
     ORDER BY total_donations DESC, f.facility_name ASC`
  );
  return rows;
};

// A- GROUP BY with HAVING: Get total donations per facility and filter facilities with total >= threshold
const getDonationStatsHaving = async (minTotal) => {
  const [rows] = await db.execute(
    `SELECT f.facility_id, f.facility_name, f.city,
            COUNT(d.donation_id) AS donation_count,
            COALESCE(SUM(d.amount), 0) AS total_amount
     FROM facilities f
     LEFT JOIN donations d ON f.facility_id = d.facility_id
     GROUP BY f.facility_id, f.facility_name, f.city
     HAVING total_amount >= ?
     ORDER BY total_amount DESC`,
    [minTotal]
  );
  return rows;
};

// ratri - Top donors by total donated
const getTopDonorsByTotalDonated = async () => {
  const [rows] = await db.execute(
    `SELECT u.user_id, u.full_name, u.email,
            COUNT(d.donation_id) AS donation_count,
            ROUND(SUM(d.amount), 2) AS total_donated
     FROM users u
     JOIN donations d ON u.user_id = d.user_id
     GROUP BY u.user_id, u.full_name, u.email
     ORDER BY total_donated DESC, donation_count DESC`
  );
  return rows;
};

// A- GROUP BY with HAVING: Get top donors (users) having donated more than min amount total
const getTopDonorsHaving = async (minTotal) => {
  const [rows] = await db.execute(
    `SELECT u.user_id, u.full_name, u.email,
            COUNT(d.donation_id) AS donation_count,
            SUM(d.amount) AS total_donated
     FROM users u
     JOIN donations d ON u.user_id = d.user_id
     GROUP BY u.user_id, u.full_name, u.email
     HAVING total_donated >= ?
     ORDER BY total_donated DESC`,
    [minTotal]
  );
  return rows;
};

// A- Subquery: Find donations with amount greater than average donation amount (scalar subquery)
const getDonationsAboveAverage = async () => {
  const [rows] = await db.execute(
    `SELECT d.donation_id, d.amount, d.donation_type, u.full_name, f.facility_name
     FROM donations d
     JOIN users u ON d.user_id = u.user_id
     JOIN facilities f ON d.facility_id = f.facility_id
     WHERE d.amount > (SELECT AVG(amount) FROM donations)
     ORDER BY d.amount DESC`
  );
  return rows;
};

// A- Subquery with IN: Find users who have donated to 'food_bank' facilities (IN subquery)
const getDonorsToFoodBankSubquery = async () => {
  const [rows] = await db.execute(
    `SELECT DISTINCT u.user_id, u.full_name, u.email
     FROM users u
     WHERE u.user_id IN (
       SELECT d.user_id FROM donations d
       JOIN facilities f ON d.facility_id = f.facility_id
       WHERE f.facility_type = 'food_bank'
     )
     ORDER BY u.full_name`
  );
  return rows;
};

module.exports = {
  getAllDonations,
  getDonationsByFacility,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  getFacilitiesAndDonations,
  getFacilityDonationTotals,
  getDonationStatsHaving,
  getTopDonorsByTotalDonated,
  getTopDonorsHaving,
  getDonationsAboveAverage,
  getDonorsToFoodBankSubquery,
};
