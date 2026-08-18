const db = require('../config/db');

const getAllContacts = async () => {
  const [rows] = await db.execute(
    `SELECT ec.*, s.shelter_name
     FROM emergency_contacts ec
     JOIN shelters s ON ec.shelter_id = s.shelter_id
     ORDER BY ec.contact_id DESC`
  );
  return rows;
};

const getContactsByShelter = async (shelterId) => {
  const [rows] = await db.execute(
    'SELECT * FROM emergency_contacts WHERE shelter_id = ?',
    [shelterId]
  );
  return rows;
};

const getContactById = async (contactId) => {
  const [rows] = await db.execute(
    'SELECT * FROM emergency_contacts WHERE contact_id = ?',
    [contactId]
  );
  return rows[0] || null;
};

const createContact = async (contactData) => {
  const { shelter_id, contact_name, contact_phone, contact_role, is_primary } = contactData;
  const [result] = await db.execute(
    `INSERT INTO emergency_contacts (shelter_id, contact_name, contact_phone, contact_role, is_primary)
     VALUES (?, ?, ?, ?, ?)`,
    [shelter_id, contact_name, contact_phone, contact_role || null, is_primary !== undefined ? is_primary : false]
  );
  return result.insertId;
};

const updateContact = async (contactId, contactData) => {
  const { shelter_id, contact_name, contact_phone, contact_role, is_primary } = contactData;
  const [result] = await db.execute(
    `UPDATE emergency_contacts SET
      shelter_id = ?,
      contact_name = ?,
      contact_phone = ?,
      contact_role = ?,
      is_primary = ?
    WHERE contact_id = ?`,
    [shelter_id, contact_name, contact_phone, contact_role || null, is_primary !== undefined ? is_primary : false, contactId]
  );
  return result.affectedRows;
};

const deleteContact = async (contactId) => {
  const [result] = await db.execute(
    'DELETE FROM emergency_contacts WHERE contact_id = ?',
    [contactId]
  );
  return result.affectedRows;
};

module.exports = {
  getAllContacts,
  getContactsByShelter,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
