const db = require('../config/db');

const getAllServices = async () => {
  const [rows] = await db.execute(
    'SELECT * FROM services ORDER BY service_id DESC'
  );
  return rows;
};

const getServiceById = async (serviceId) => {
  const [rows] = await db.execute(
    'SELECT * FROM services WHERE service_id = ?',
    [serviceId]
  );
  return rows[0] || null;
};

const createService = async (serviceData) => {
  const { service_name, service_description, category } = serviceData;
  const [result] = await db.execute(
    `INSERT INTO services (service_name, service_description, category)
     VALUES (?, ?, ?)`,
    [service_name, service_description || null, category || null]
  );
  return result.insertId;
};

const updateService = async (serviceId, serviceData) => {
  const { service_name, service_description, category } = serviceData;
  const [result] = await db.execute(
    `UPDATE services SET
      service_name = ?,
      service_description = ?,
      category = ?
    WHERE service_id = ?`,
    [service_name, service_description || null, category || null, serviceId]
  );
  return result.affectedRows;
};

const deleteService = async (serviceId) => {
  const [result] = await db.execute(
    'DELETE FROM services WHERE service_id = ?',
    [serviceId]
  );
  return result.affectedRows;
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
