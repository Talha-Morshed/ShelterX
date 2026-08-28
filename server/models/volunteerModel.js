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

// A- GROUP BY with HAVING: Get facilities having at least N volunteers (volunteer demand report)
const getFacilitiesWithMinVolunteersHaving = async (minCount) => {
  const [rows] = await db.execute(
    `SELECT f.facility_id, f.facility_name, f.city,
            COUNT(v.volunteer_id) AS volunteer_count
     FROM facilities f
     JOIN volunteers v ON f.facility_id = v.facility_id
     GROUP BY f.facility_id, f.facility_name, f.city
     HAVING volunteer_count >= ?
     ORDER BY volunteer_count DESC`,
    [minCount]
  );
  return rows;
};

// A- GROUP BY with HAVING: Get volunteer status counts having > threshold (pending/approved distribution)
const getVolunteerStatusStatsHaving = async (minCount) => {
  const [rows] = await db.execute(
    `SELECT status,
            COUNT(*) AS total,
            COUNT(DISTINCT facility_id) AS facilities_covered
     FROM volunteers
     GROUP BY status
     HAVING total >= ?
     ORDER BY total DESC`,
    [minCount]
  );
  return rows;
};

// A- Subquery: Find volunteers who are also donors (IN subquery across two tables)
const getVolunteersWhoAreDonorsSubquery = async () => {
  const [rows] = await db.execute(
    `SELECT DISTINCT u.user_id, u.full_name, u.email
     FROM users u
     WHERE u.user_id IN (SELECT user_id FROM volunteers)
       AND u.user_id IN (SELECT user_id FROM donations)
     ORDER BY u.full_name`
  );
  return rows;
};

// A- Subquery: Find facilities with volunteer count greater than average volunteer count per facility (scalar subquery with derived table)
const getFacilitiesAboveAvgVolunteersSubquery = async () => {
  const [rows] = await db.execute(
    `SELECT f.facility_id, f.facility_name, f.city,
            (SELECT COUNT(*) FROM volunteers v WHERE v.facility_id = f.facility_id) AS volunteer_count
     FROM facilities f
     WHERE (SELECT COUNT(*) FROM volunteers v WHERE v.facility_id = f.facility_id) >
           (SELECT AVG(cnt) FROM (SELECT COUNT(*) AS cnt FROM volunteers GROUP BY facility_id) AS t)
     ORDER BY volunteer_count DESC`
  );
  return rows;
};

module.exports = {
  getAllVolunteers,
  getVolunteersByFacility,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getFacilitiesWithMinVolunteersHaving,
  getVolunteerStatusStatsHaving,
  getVolunteersWhoAreDonorsSubquery,
  getFacilitiesAboveAvgVolunteersSubquery,
};
