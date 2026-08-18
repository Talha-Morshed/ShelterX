const db = require('../config/db');

const getAllDonations = async () => {
  const [rows] = await db.execute(
    `SELECT d.*, u.full_name, s.shelter_name
     FROM donations d
     JOIN users u ON d.user_id = u.user_id
     JOIN shelters s ON d.shelter_id = s.shelter_id
     ORDER BY d.donation_id DESC`
  );
  return rows;
};

const getDonationsByShelter = async (shelterId) => {
  const [rows] = await db.execute(
    `SELECT d.*, u.full_name
     FROM donations d
     JOIN users u ON d.user_id = u.user_id
     WHERE d.shelter_id = ?`,
    [shelterId]
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
  const { shelter_id, user_id, amount, donation_type, notes } = donationData;
  const [result] = await db.execute(
    `INSERT INTO donations (shelter_id, user_id, amount, donation_type, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [shelter_id, user_id, amount, donation_type || 'money', notes || null]
  );
  return result.insertId;
};

const updateDonation = async (donationId, donationData) => {
  const { shelter_id, user_id, amount, donation_type, notes } = donationData;
  const [result] = await db.execute(
    `UPDATE donations SET
      shelter_id = ?,
      user_id = ?,
      amount = ?,
      donation_type = ?,
      notes = ?
    WHERE donation_id = ?`,
    [shelter_id, user_id, amount, donation_type || 'money', notes || null, donationId]
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
  getDonationsByShelter,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
};
