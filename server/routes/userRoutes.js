const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllUsersWithReviews,
} = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/with-reviews', getAllUsersWithReviews);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
