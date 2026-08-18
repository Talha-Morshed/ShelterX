const db = require('../config/db');

const getAllVolunteers = async () => {
  const [rows] = await db.execute(
    `SELECT v.*, u.full_name, s.shelter_name
     FROM volunteers v
     JOIN users u ON v.user_id = u.user_id
     JOIN shelters s ON v.shelter_id = s.shelter_id
     ORDER BY v.volunteer_id DESC`
  );
  return rows;
};

const getVolunteersByShelter = async (shelterId) => {
  const [rows] = await db.execute(
    `SELECT v.*, u.full_name
     FROM volunteers v
     JOIN users u ON v.user_id = u.user_id
     WHERE v.shelter_id = ?`,
    [shelterId]
  );
  return rows;
};

const getVolunteerById = async (volunteerId) => {
  const [rows] = await db.execute(
    'SELECT * FROM volunteers WHERE volunteer_id = ?',
    [volunteerId]
  );
  return rows[0] || null;
};

const createVolunteer = async (volunteerData) => {
  const { shelter_id, user_id, role, availability, status } = volunteerData;
  const [result] = await db.execute(
    `INSERT INTO volunteers (shelter_id, user_id, role, availability, status)
     VALUES (?, ?, ?, ?, ?)`,
    [shelter_id, user_id, role || null, availability || null, status || 'pending']
  );
  return result.insertId;
};

const updateVolunteer = async (volunteerId, volunteerData) => {
  const { shelter_id, user_id, role, availability, status } = volunteerData;
  const [result] = await db.execute(
    `UPDATE volunteers SET
      shelter_id = ?,
      user_id = ?,
      role = ?,
      availability = ?,
      status = ?
    WHERE volunteer_id = ?`,
    [shelter_id, user_id, role || null, availability || null, status || 'pending', volunteerId]
  );
  return result.affectedRows;
};

const deleteVolunteer = async (volunteerId) => {
  const [result] = await db.execute(
    'DELETE FROM volunteers WHERE volunteer_id = ?',
    [volunteerId]
  );
  return result.affectedRows;
};

module.exports = {
  getAllVolunteers,
  getVolunteersByShelter,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};
