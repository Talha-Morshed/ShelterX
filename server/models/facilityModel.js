const db = require('../config/db');

const getAllFacilities = async () => {
  const [rows] = await db.execute(
    'SELECT * FROM facilities ORDER BY facility_id DESC'
  );
  return rows;
};

const getFacilityById = async (facilityId) => {
  const [rows] = await db.execute(
    'SELECT * FROM facilities WHERE facility_id = ?',
    [facilityId]
  );
  return rows[0] || null;
};

const createFacility = async (facilityData) => {
  const {
    facility_name,
    facility_type,
    address,
    city,
    phone,
    capacity,
    available_spaces,
    description,
    latitude,
    longitude,
  } = facilityData;

  const [result] = await db.execute(
    `INSERT INTO facilities (
      facility_name,
      facility_type,
      address,
      city,
      phone,
      capacity,
      available_spaces,
      description,
      latitude,
      longitude
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      facility_name,
      facility_type,
      address,
      city,
      phone,
      capacity,
      available_spaces,
      description,
      latitude,
      longitude,
    ]
  );

  return result.insertId;
};

const updateFacility = async (facilityId, facilityData) => {
  const {
    facility_name,
    facility_type,
    address,
    city,
    phone,
    capacity,
    available_spaces,
    description,
    latitude,
    longitude,
  } = facilityData;

  const [result] = await db.execute(
    `UPDATE facilities SET
      facility_name = ?,
      facility_type = ?,
      address = ?,
      city = ?,
      phone = ?,
      capacity = ?,
      available_spaces = ?,
      description = ?,
      latitude = ?,
      longitude = ?
    WHERE facility_id = ?`,
    [
      facility_name,
      facility_type,
      address,
      city,
      phone,
      capacity,
      available_spaces,
      description,
      latitude,
      longitude,
      facilityId,
    ]
  );

  return result.affectedRows;
};

const deleteFacility = async (facilityId) => {
  const [result] = await db.execute(
    'DELETE FROM facilities WHERE facility_id = ?',
    [facilityId]
  );
  return result.affectedRows;
};

const getFacilitiesWithReviews = async () => {
  const [rows] = await db.execute(
    `SELECT f.facility_id, f.facility_name, f.facility_type, f.city,
            COUNT(r.review_id) AS total_reviews,
            ROUND(AVG(r.rating), 1) AS avg_rating
     FROM facilities f
     LEFT JOIN reviews r ON f.facility_id = r.facility_id
     GROUP BY f.facility_id, f.facility_name, f.facility_type, f.city
     ORDER BY f.facility_id`
  );
  return rows;
};

module.exports = {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
  getFacilitiesWithReviews,
};
