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

module.exports = {
  getAllDonations,
  getDonationsByFacility,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
};
