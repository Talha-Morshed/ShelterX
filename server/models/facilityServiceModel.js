const db = require('../config/db');

const getAllFacilityServices = async () => {
  const [rows] = await db.execute(
    `SELECT fs.*, f.facility_name, sv.service_name
     FROM facility_services fs
     JOIN facilities f ON fs.facility_id = f.facility_id
     JOIN services sv ON fs.service_id = sv.service_id
     ORDER BY fs.id DESC`
  );
  return rows;
};

const getFacilityServicesByFacility = async (facilityId) => {
  const [rows] = await db.execute(
    `SELECT fs.*, sv.service_name, sv.service_description, sv.category
     FROM facility_services fs
     JOIN services sv ON fs.service_id = sv.service_id
     WHERE fs.facility_id = ?`,
    [facilityId]
  );
  return rows;
};

const getFacilityServiceById = async (id) => {
  const [rows] = await db.execute(
    'SELECT * FROM facility_services WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

const createFacilityService = async (data) => {
  const { facility_id, service_id, is_available, notes } = data;
  const [result] = await db.execute(
    `INSERT INTO facility_services (facility_id, service_id, is_available, notes)
     VALUES (?, ?, ?, ?)`,
    [facility_id, service_id, is_available !== undefined ? is_available : true, notes || null]
  );
  return result.insertId;
};

const updateFacilityService = async (id, data) => {
  const { facility_id, service_id, is_available, notes } = data;
  const [result] = await db.execute(
    `UPDATE facility_services SET
      facility_id = ?,
      service_id = ?,
      is_available = ?,
      notes = ?
    WHERE id = ?`,
    [facility_id, service_id, is_available !== undefined ? is_available : true, notes || null, id]
  );
  return result.affectedRows;
};

const deleteFacilityService = async (id) => {
  const [result] = await db.execute(
    'DELETE FROM facility_services WHERE id = ?',
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  getAllFacilityServices,
  getFacilityServicesByFacility,
  getFacilityServiceById,
  createFacilityService,
  updateFacilityService,
  deleteFacilityService,
};
