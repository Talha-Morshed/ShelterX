const express = require('express');
const {
  getAllReviews,
  getByShelter,
  getById,
  create,
  update,
  remove,
} = require('../controllers/reviewController');

const router = express.Router();

router.get('/', getAllReviews);
router.get('/shelter/:shelterId', getByShelter);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
