const db = require('../config/db');

const getAllReviews = async () => {
  const [rows] = await db.execute(
    `SELECT r.*, u.full_name, f.facility_name
     FROM reviews r
     JOIN users u ON r.user_id = u.user_id
     JOIN facilities f ON r.facility_id = f.facility_id
     ORDER BY r.review_id DESC`
  );
  return rows;
};

const getReviewsByFacility = async (facilityId) => {
  const [rows] = await db.execute(
    `SELECT r.*, u.full_name
     FROM reviews r
     JOIN users u ON r.user_id = u.user_id
     WHERE r.facility_id = ?`,
    [facilityId]
  );
  return rows;
};

const getReviewById = async (reviewId) => {
  const [rows] = await db.execute(
    'SELECT * FROM reviews WHERE review_id = ?',
    [reviewId]
  );
  return rows[0] || null;
};

const createReview = async (reviewData) => {
  const { facility_id, user_id, rating, comment } = reviewData;
  const [result] = await db.execute(
    `INSERT INTO reviews (facility_id, user_id, rating, comment)
     VALUES (?, ?, ?, ?)`,
    [facility_id, user_id, rating, comment || null]
  );
  return result.insertId;
};

const updateReview = async (reviewId, reviewData) => {
  const { facility_id, user_id, rating, comment } = reviewData;
  const [result] = await db.execute(
    `UPDATE reviews SET
      facility_id = ?,
      user_id = ?,
      rating = ?,
      comment = ?
    WHERE review_id = ?`,
    [facility_id, user_id, rating, comment || null, reviewId]
  );
  return result.affectedRows;
};

const deleteReview = async (reviewId) => {
  const [result] = await db.execute(
    'DELETE FROM reviews WHERE review_id = ?',
    [reviewId]
  );
  return result.affectedRows;
};

// A- GROUP BY with HAVING: Get facilities with average rating >= threshold and at least N reviews
const getHighRatedFacilitiesHaving = async (minRating, minReviews) => {
  const [rows] = await db.execute(
    `SELECT f.facility_id, f.facility_name, f.city,
            COUNT(r.review_id) AS review_count,
            ROUND(AVG(r.rating), 2) AS avg_rating
     FROM facilities f
     JOIN reviews r ON f.facility_id = r.facility_id
     GROUP BY f.facility_id, f.facility_name, f.city
     HAVING avg_rating >= ? AND review_count >= ?
     ORDER BY avg_rating DESC`,
    [minRating, minReviews]
  );
  return rows;
};

// A- GROUP BY with HAVING: Get users who have written more than N reviews (active reviewers)
const getActiveReviewersHaving = async (minReviews) => {
  const [rows] = await db.execute(
    `SELECT u.user_id, u.full_name, u.email,
            COUNT(r.review_id) AS review_count,
            AVG(r.rating) AS avg_given_rating
     FROM users u
     JOIN reviews r ON u.user_id = r.user_id
     GROUP BY u.user_id, u.full_name, u.email
     HAVING review_count >= ?
     ORDER BY review_count DESC`,
    [minReviews]
  );
  return rows;
};

// A- Subquery: Find reviews with rating higher than the overall average rating (scalar subquery)
const getReviewsAboveAvgRating = async () => {
  const [rows] = await db.execute(
    `SELECT r.review_id, r.rating, r.comment, u.full_name, f.facility_name
     FROM reviews r
     JOIN users u ON r.user_id = u.user_id
     JOIN facilities f ON f.facility_id = r.facility_id
     WHERE r.rating > (SELECT AVG(rating) FROM reviews)
     ORDER BY r.rating DESC`
  );
  return rows;
};

// A- Subquery: Find facilities that have never been reviewed (NOT IN subquery)
const getUnreviewedFacilitiesSubquery = async () => {
  const [rows] = await db.execute(
    `SELECT facility_id, facility_name, city
     FROM facilities
     WHERE facility_id NOT IN (SELECT facility_id FROM reviews)
     ORDER BY facility_name`
  );
  return rows;
};

module.exports = {
  getAllReviews,
  getReviewsByFacility,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getHighRatedFacilitiesHaving,
  getActiveReviewersHaving,
  getReviewsAboveAvgRating,
  getUnreviewedFacilitiesSubquery,
};
