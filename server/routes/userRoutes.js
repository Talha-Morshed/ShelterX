const express = require('express');
const {
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

// A- GROUP BY + HAVING route for users
router.get('/stats/active-having', getActiveUsersHaving);
// A- Subquery routes for users
router.get('/stats/never-donated-subquery', getUsersNeverDonatedSubquery);
router.get('/stats/above-avg-donation-subquery', getUsersAboveAvgDonationSubquery);

router.get('/', getAllUsers);
router.get('/with-reviews', getAllUsersWithReviews);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
