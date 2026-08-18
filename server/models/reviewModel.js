const db = require('../config/db');

const getAllReviews = async () => {
  const [rows] = await db.execute(
    `SELECT r.*, u.full_name, s.shelter_name
     FROM reviews r
     JOIN users u ON r.user_id = u.user_id
     JOIN shelters s ON r.shelter_id = s.shelter_id
     ORDER BY r.review_id DESC`
  );
  return rows;
};

const getReviewsByShelter = async (shelterId) => {
  const [rows] = await db.execute(
    `SELECT r.*, u.full_name
     FROM reviews r
     JOIN users u ON r.user_id = u.user_id
     WHERE r.shelter_id = ?`,
    [shelterId]
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
  const { shelter_id, user_id, rating, comment } = reviewData;
  const [result] = await db.execute(
    `INSERT INTO reviews (shelter_id, user_id, rating, comment)
     VALUES (?, ?, ?, ?)`,
    [shelter_id, user_id, rating, comment || null]
  );
  return result.insertId;
};

const updateReview = async (reviewId, reviewData) => {
  const { shelter_id, user_id, rating, comment } = reviewData;
  const [result] = await db.execute(
    `UPDATE reviews SET
      shelter_id = ?,
      user_id = ?,
      rating = ?,
      comment = ?
    WHERE review_id = ?`,
    [shelter_id, user_id, rating, comment || null, reviewId]
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
  getReviewsByShelter,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
