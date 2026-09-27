const db = require('../config/db');

// Adnan - Read the reusable facility overview SQL view for dashboard reporting.
const getFacilityOverviewView = async () => {
  const [rows] = await db.execute('SELECT * FROM vw_facility_overview ORDER BY total_donations DESC, facility_name ASC');
  return rows;
};

// Adnan - Read the reusable service availability SQL view for dashboard reporting.
const getServiceAvailabilityView = async () => {
  const [rows] = await db.execute('SELECT * FROM vw_service_availability ORDER BY facility_name ASC, service_name ASC');
  return rows;
};

// Adnan - Read the public directory view that hides internal facility columns.
const getPublicFacilityDirectoryView = async () => {
  const [rows] = await db.execute('SELECT * FROM vw_public_facility_directory ORDER BY city ASC, facility_name ASC');
  return rows;
};

// Adnan - Execute the capacity stored procedure with a validated minimum capacity.
const getFacilitiesByMinCapacityProcedure = async (minCapacity) => {
  const [rows] = await db.execute('CALL sp_facilities_by_min_capacity(?)', [minCapacity]);
  return rows[0] || [];
};

// Adnan - Execute the activity stored procedure with an optional city filter.
const getFacilityActivityProcedure = async (city) => {
  const [rows] = await db.execute('CALL sp_facility_activity_report(?)', [city || null]);
  return rows[0] || [];
};

// Adnan - Execute the conditional capacity procedure with a validated threshold.
const getFacilityCapacityStatusProcedure = async (minCapacity) => {
  const [rows] = await db.execute('CALL sp_facility_capacity_status(?)', [minCapacity]);
  return rows[0] || [];
};

// Adnan - Execute the loop procedure that returns temporary capacity-band totals.
const getFacilityCapacityBandsProcedure = async () => {
  const [rows] = await db.execute('CALL sp_facility_capacity_bands()');
  return rows[0] || [];
};

module.exports = {
  getFacilityOverviewView,
  getServiceAvailabilityView,
  getPublicFacilityDirectoryView,
  getFacilitiesByMinCapacityProcedure,
  getFacilityActivityProcedure,
  getFacilityCapacityStatusProcedure,
  getFacilityCapacityBandsProcedure,
};