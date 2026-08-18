const db = require('../config/db');

const getAllShelterServices = async () => {
  const [rows] = await db.execute(
    `SELECT ss.*, s.shelter_name, sv.service_name
     FROM shelter_services ss
     JOIN shelters s ON ss.shelter_id = s.shelter_id
     JOIN services sv ON ss.service_id = sv.service_id
     ORDER BY ss.id DESC`
  );
  return rows;
};

const getShelterServicesByShelter = async (shelterId) => {
  const [rows] = await db.execute(
    `SELECT ss.*, sv.service_name, sv.service_description, sv.category
     FROM shelter_services ss
     JOIN services sv ON ss.service_id = sv.service_id
     WHERE ss.shelter_id = ?`,
    [shelterId]
  );
  return rows;
};

const getShelterServiceById = async (id) => {
  const [rows] = await db.execute(
    'SELECT * FROM shelter_services WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

const createShelterService = async (data) => {
  const { shelter_id, service_id, is_available, notes } = data;
  const [result] = await db.execute(
    `INSERT INTO shelter_services (shelter_id, service_id, is_available, notes)
     VALUES (?, ?, ?, ?)`,
    [shelter_id, service_id, is_available !== undefined ? is_available : true, notes || null]
  );
  return result.insertId;
};

const updateShelterService = async (id, data) => {
  const { shelter_id, service_id, is_available, notes } = data;
  const [result] = await db.execute(
    `UPDATE shelter_services SET
      shelter_id = ?,
      service_id = ?,
      is_available = ?,
      notes = ?
    WHERE id = ?`,
    [shelter_id, service_id, is_available !== undefined ? is_available : true, notes || null, id]
  );
  return result.affectedRows;
};

const deleteShelterService = async (id) => {
  const [result] = await db.execute(
    'DELETE FROM shelter_services WHERE id = ?',
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  getAllShelterServices,
  getShelterServicesByShelter,
  getShelterServiceById,
  createShelterService,
  updateShelterService,
  deleteShelterService,
};
