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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersWithReviews,
};
