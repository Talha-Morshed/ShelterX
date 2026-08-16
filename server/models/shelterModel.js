const db = require('../config/db');

const getAllShelters = async () => {
  const [rows] = await db.execute(
    'SELECT * FROM shelters ORDER BY shelter_id DESC'
  );
  return rows;
};

const getShelterById = async (shelterId) => {
  const [rows] = await db.execute(
    'SELECT * FROM shelters WHERE shelter_id = ?',
    [shelterId]
  );
  return rows[0] || null;
};

const createShelter = async (shelterData) => {
  const {
    shelter_name,
    shelter_type,
    address,
    city,
    phone,
    capacity,
    available_spaces,
    description,
    latitude,
    longitude,
  } = shelterData;

  const [result] = await db.execute(
    `INSERT INTO shelters (
      shelter_name,
      shelter_type,
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
      shelter_name,
      shelter_type,
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

const updateShelter = async (shelterId, shelterData) => {
  const {
    shelter_name,
    shelter_type,
    address,
    city,
    phone,
    capacity,
    available_spaces,
    description,
    latitude,
    longitude,
  } = shelterData;

  const [result] = await db.execute(
    `UPDATE shelters SET
      shelter_name = ?,
      shelter_type = ?,
      address = ?,
      city = ?,
      phone = ?,
      capacity = ?,
      available_spaces = ?,
      description = ?,
      latitude = ?,
      longitude = ?
      WHERE shelter_id = ?`,
    [
      shelter_name,
      shelter_type,
      address,
      city,
      phone,
      capacity,
      available_spaces,
      description,
      latitude,
      longitude,
      shelterId,
    ]
  );

  return result.affectedRows;
};

const deleteShelter = async (shelterId) => {
  const [result] = await db.execute(
    'DELETE FROM shelters WHERE shelter_id = ?',
    [shelterId]
  );
  return result.affectedRows;
};

module.exports = {
  getAllShelters,
  getShelterById,
  createShelter,
  updateShelter,
  deleteShelter,
};
