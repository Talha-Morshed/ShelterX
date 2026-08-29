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

// A- COUNT aggregate: count reviews per facility
const getFacilityReviewCounts = async () => {
  const [rows] = await db.execute(
    `SELECT f.facility_id AS facility_id, f.facility_name, f.city,
            COUNT(r.review_id) AS review_count
     FROM facilities f
     LEFT JOIN reviews r ON f.facility_id = r.facility_id
     GROUP BY f.facility_id, f.facility_name, f.city
     ORDER BY review_count DESC, f.facility_name ASC`
  );
  return rows;
};

// A- AVG aggregate: average rating per facility
const getFacilityAverageRatings = async () => {
  const [rows] = await db.execute(
    `SELECT f.facility_id AS facility_id, f.facility_name, f.city,
            ROUND(AVG(r.rating), 2) AS avg_rating
     FROM facilities f
     JOIN reviews r ON f.facility_id = r.facility_id
     GROUP BY f.facility_id, f.facility_name, f.city
     ORDER BY avg_rating DESC, f.facility_name ASC`
  );
  return rows;
};

// A- GROUP BY with HAVING: Find facilities having more than given number of reviews (aggregation + HAVING filter)
const getFacilitiesHavingMinReviews = async (minReviews) => {
  const [rows] = await db.execute(
    `SELECT f.facility_id, f.facility_name, f.city,
            COUNT(r.review_id) AS total_reviews,
            ROUND(AVG(r.rating), 1) AS avg_rating
     FROM facilities f
     LEFT JOIN reviews r ON f.facility_id = r.facility_id
     GROUP BY f.facility_id, f.facility_name, f.city
     HAVING total_reviews >= ?
     ORDER BY total_reviews DESC`,
    [minReviews]
  );
  return rows;
};

// A- GROUP BY with HAVING: Group facilities by type and show only types with total capacity > threshold
const getFacilityTypeStatsHaving = async (minTotalCapacity) => {
  const [rows] = await db.execute(
    `SELECT facility_type,
            COUNT(*) AS facility_count,
            SUM(capacity) AS total_capacity,
            AVG(capacity) AS avg_capacity
     FROM facilities
     GROUP BY facility_type
     HAVING total_capacity >= ?
     ORDER BY total_capacity DESC`,
    [minTotalCapacity]
  );
  return rows;
};

// A- GROUP BY with HAVING: Find cities having more than N facilities (city-wise aggregation)
const getCitiesHavingManyFacilities = async (minCount) => {
  const [rows] = await db.execute(
    `SELECT city,
            COUNT(*) AS facility_count,
            SUM(available_spaces) AS total_available
     FROM facilities
     GROUP BY city
     HAVING facility_count >= ?
     ORDER BY facility_count DESC`,
    [minCount]
  );
  return rows;
};

// A- Subquery: Find facilities with capacity greater than average capacity (single-row subquery)
const getFacilitiesAboveAvgCapacity = async () => {
  const [rows] = await db.execute(
    `SELECT facility_id, facility_name, city, capacity
     FROM facilities
     WHERE capacity > (SELECT AVG(capacity) FROM facilities)
     ORDER BY capacity DESC`
  );
  return rows;
};

// A- Subquery with IN: Find facilities that have received at least one donation (IN subquery)
const getFacilitiesWithDonationsSubquery = async () => {
  const [rows] = await db.execute(
    `SELECT facility_id, facility_name, city, capacity
     FROM facilities
     WHERE facility_id IN (SELECT DISTINCT facility_id FROM donations)
     ORDER BY facility_name`
  );
  return rows;
};

// A- Subquery with EXISTS: Find facilities that have at least one 5-star review (EXISTS correlated subquery)
const getFacilitiesWithFiveStarReviews = async () => {
  const [rows] = await db.execute(
    `SELECT f.facility_id, f.facility_name, f.city
     FROM facilities f
     WHERE EXISTS (
       SELECT 1 FROM reviews r
       WHERE r.facility_id = f.facility_id AND r.rating = 5
     )
     ORDER BY f.facility_name`
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
  getFacilityReviewCounts,
  getFacilityAverageRatings,
  getFacilitiesHavingMinReviews,
  getFacilityTypeStatsHaving,
  getCitiesHavingManyFacilities,
  getFacilitiesAboveAvgCapacity,
  getFacilitiesWithDonationsSubquery,
  getFacilitiesWithFiveStarReviews,
};
