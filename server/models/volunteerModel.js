const db = require('../config/db');

const getAllVolunteers = async () => {
  const [rows] = await db.execute(
    `SELECT v.*, u.full_name, f.facility_name
     FROM volunteers v
     JOIN users u ON v.user_id = u.user_id
     JOIN facilities f ON v.facility_id = f.facility_id
     ORDER BY v.volunteer_id DESC`
  );
  return rows;
};

const getVolunteersByFacility = async (facilityId) => {
  const [rows] = await db.execute(
    `SELECT v.*, u.full_name
     FROM volunteers v
     JOIN users u ON v.user_id = u.user_id
     WHERE v.facility_id = ?`,
    [facilityId]
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
  const { facility_id, user_id, role, availability, status } = volunteerData;
  const [result] = await db.execute(
    `INSERT INTO volunteers (facility_id, user_id, role, availability, status)
     VALUES (?, ?, ?, ?, ?)`,
    [facility_id, user_id, role || null, availability || null, status || 'pending']
  );
  return result.insertId;
};

const updateVolunteer = async (volunteerId, volunteerData) => {
  const { facility_id, user_id, role, availability, status } = volunteerData;
  const [result] = await db.execute(
    `UPDATE volunteers SET
      facility_id = ?,
      user_id = ?,
      role = ?,
      availability = ?,
      status = ?
    WHERE volunteer_id = ?`,
    [facility_id, user_id, role || null, availability || null, status || 'pending', volunteerId]
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
  getVolunteersByFacility,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};
