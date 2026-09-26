const express = require('express');
const { authenticate, authorizeRole } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllUsersWithReviews,
  getActiveUsersHaving,
  getUsersNeverDonatedSubquery,
  getUsersAboveAvgDonationSubquery,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getCurrentUser);
router.get('/admin-check', authenticate, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ ok: true, role: req.user.role, message: 'Admin access granted' });
});
router.get('/', authenticate, authorizeRole('admin'), getAllUsers);
router.get('/with-reviews', authenticate, authorizeRole('admin'), getAllUsersWithReviews);
router.get('/stats/active-having', authenticate, authorizeRole('admin'), getActiveUsersHaving);
router.get('/stats/never-donated-subquery', authenticate, authorizeRole('admin'), getUsersNeverDonatedSubquery);
router.get('/stats/above-avg-donation-subquery', authenticate, authorizeRole('admin'), getUsersAboveAvgDonationSubquery);
router.get('/:id', authenticate, getUserById);
router.post('/', authenticate, authorizeRole('admin'), createUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteUser);

module.exports = router;
