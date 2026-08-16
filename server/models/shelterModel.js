const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'shelters.json');

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
};

const readFallback = () => {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
};

const writeFallback = (data) => {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

const getAllShelters = async () => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM shelters ORDER BY shelter_id DESC'
    );
    return rows;
  } catch (err) {
    // fallback to JSON file when DB is unavailable
    return readFallback();
  }
};

const getShelterById = async (shelterId) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM shelters WHERE shelter_id = ?',
      [shelterId]
    );
    return rows[0] || null;
  } catch (err) {
    const list = readFallback();
    return list.find((r) => Number(r.shelter_id) === Number(shelterId)) || null;
  }
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
  try {
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
  } catch (err) {
    const list = readFallback();
    const maxId = list.reduce((m, i) => Math.max(m, Number(i.shelter_id || 0)), 0);
    const newId = maxId + 1;
    const newItem = {
      shelter_id: newId,
      shelter_name,
      shelter_type,
      address,
      city,
      phone: phone || null,
      capacity,
      available_spaces,
      description: description || null,
      latitude: latitude === '' || latitude === undefined || latitude === null ? null : latitude,
      longitude: longitude === '' || longitude === undefined || longitude === null ? null : longitude,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    list.unshift(newItem);
    writeFallback(list);
    return newId;
  }
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
  try {
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
  } catch (err) {
    const list = readFallback();
    const idx = list.findIndex((r) => Number(r.shelter_id) === Number(shelterId));
    if (idx === -1) return 0;
    const updated = Object.assign({}, list[idx], {
      shelter_name,
      shelter_type,
      address,
      city,
      phone: phone || null,
      capacity,
      available_spaces,
      description: description || null,
      latitude: latitude === '' || latitude === undefined || latitude === null ? null : latitude,
      longitude: longitude === '' || longitude === undefined || longitude === null ? null : longitude,
      updated_at: new Date().toISOString(),
    });
    list[idx] = updated;
    writeFallback(list);
    return 1;
  }
};

const deleteShelter = async (shelterId) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM shelters WHERE shelter_id = ?',
      [shelterId]
    );
    return result.affectedRows;
  } catch (err) {
    const list = readFallback();
    const newList = list.filter((r) => Number(r.shelter_id) !== Number(shelterId));
    writeFallback(newList);
    return list.length - newList.length;
  }
};

module.exports = {
  getAllShelters,
  getShelterById,
  createShelter,
  updateShelter,
  deleteShelter,
};
