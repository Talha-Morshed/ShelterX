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

module.exports = {
  getAllReviews,
  getReviewsByFacility,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
