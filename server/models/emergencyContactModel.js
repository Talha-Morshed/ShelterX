const db = require('../config/db');

const getAllContacts = async () => {
  const [rows] = await db.execute(
    `SELECT ec.*, f.facility_name
     FROM emergency_contacts ec
     JOIN facilities f ON ec.facility_id = f.facility_id
     ORDER BY ec.contact_id DESC`
  );
  return rows;
};

const getContactsByFacility = async (facilityId) => {
  const [rows] = await db.execute(
    'SELECT * FROM emergency_contacts WHERE facility_id = ?',
    [facilityId]
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
  const { facility_id, contact_name, contact_phone, contact_role, is_primary } = contactData;
  const [result] = await db.execute(
    `INSERT INTO emergency_contacts (facility_id, contact_name, contact_phone, contact_role, is_primary)
     VALUES (?, ?, ?, ?, ?)`,
    [facility_id, contact_name, contact_phone, contact_role || null, is_primary !== undefined ? is_primary : false]
  );
  return result.insertId;
};

const updateContact = async (contactId, contactData) => {
  const { facility_id, contact_name, contact_phone, contact_role, is_primary } = contactData;
  const [result] = await db.execute(
    `UPDATE emergency_contacts SET
      facility_id = ?,
      contact_name = ?,
      contact_phone = ?,
      contact_role = ?,
      is_primary = ?
    WHERE contact_id = ?`,
    [facility_id, contact_name, contact_phone, contact_role || null, is_primary !== undefined ? is_primary : false, contactId]
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
  getContactsByFacility,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
