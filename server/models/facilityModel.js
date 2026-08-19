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

module.exports = {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};
