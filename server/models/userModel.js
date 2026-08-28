const db = require('../config/db');

const getAllUsers = async () => {
  const [rows] = await db.execute(
    'SELECT user_id, full_name, email, phone, role, created_at, updated_at FROM users ORDER BY user_id DESC'
  );
  return rows;
};

const getUserById = async (userId) => {
  const [rows] = await db.execute(
    'SELECT user_id, full_name, email, phone, role, created_at, updated_at FROM users WHERE user_id = ?',
    [userId]
  );
  return rows[0] || null;
};

const createUser = async (userData) => {
  const { full_name, email, password, phone, role } = userData;
  const [result] = await db.execute(
    `INSERT INTO users (full_name, email, password, phone, role)
     VALUES (?, ?, ?, ?, ?)`,
    [full_name, email, password, phone || null, role || 'user']
  );
  return result.insertId;
};

const updateUser = async (userId, userData) => {
  const { full_name, email, password, phone, role } = userData;
  const [result] = await db.execute(
    `UPDATE users SET
      full_name = ?,
      email = ?,
      password = ?,
      phone = ?,
      role = ?
    WHERE user_id = ?`,
    [full_name, email, password, phone || null, role || 'user', userId]
  );
  return result.affectedRows;
};

const deleteUser = async (userId) => {
  const [result] = await db.execute(
    'DELETE FROM users WHERE user_id = ?',
    [userId]
  );
  return result.affectedRows;
};

const getUsersWithReviews = async () => {
  const [rows] = await db.execute(
    `SELECT u.user_id, u.full_name, u.email,
            r.review_id, r.rating, r.comment
     FROM reviews r
     RIGHT JOIN users u ON r.user_id = u.user_id
     ORDER BY u.user_id`
  );
  return rows;
};

// A- GROUP BY with HAVING: Find users having activity in multiple tables (donations + reviews + volunteers)
const getActiveUsersHaving = async (minActivities) => {
  const [rows] = await db.execute(
    `SELECT u.user_id, u.full_name, u.email,
            COUNT(DISTINCT d.donation_id) AS donation_count,
            COUNT(DISTINCT r.review_id) AS review_count,
            COUNT(DISTINCT v.volunteer_id) AS volunteer_count,
            (COUNT(DISTINCT d.donation_id) + COUNT(DISTINCT r.review_id) + COUNT(DISTINCT v.volunteer_id)) AS total_activities
     FROM users u
     LEFT JOIN donations d ON u.user_id = d.user_id
     LEFT JOIN reviews r ON u.user_id = r.user_id
     LEFT JOIN volunteers v ON u.user_id = v.user_id
     GROUP BY u.user_id, u.full_name, u.email
     HAVING total_activities >= ?
     ORDER BY total_activities DESC`,
    [minActivities]
  );
  return rows;
};

// A- Subquery: Find users who never donated (NOT IN subquery)
const getUsersNeverDonatedSubquery = async () => {
  const [rows] = await db.execute(
    `SELECT user_id, full_name, email
     FROM users
     WHERE user_id NOT IN (SELECT user_id FROM donations)
     ORDER BY full_name`
  );
  return rows;
};

// A- Subquery: Find users whose donation total exceeds average donor total (correlated scalar subquery)
const getUsersAboveAvgDonationSubquery = async () => {
  const [rows] = await db.execute(
    `SELECT u.user_id, u.full_name,
            (SELECT COALESCE(SUM(amount),0) FROM donations d WHERE d.user_id = u.user_id) AS total_donated
     FROM users u
     WHERE (SELECT COALESCE(SUM(amount),0) FROM donations d WHERE d.user_id = u.user_id) >
           (SELECT AVG(user_total) FROM (SELECT SUM(amount) AS user_total FROM donations GROUP BY user_id) AS t)
     ORDER BY total_donated DESC`
  );
  return rows;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersWithReviews,
  getActiveUsersHaving,
  getUsersNeverDonatedSubquery,
  getUsersAboveAvgDonationSubquery,
};
