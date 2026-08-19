const express = require('express');
const {
  getAllReviews,
  getByFacility,
  getById,
  create,
  update,
  remove,
} = require('../controllers/reviewController');

const router = express.Router();

router.get('/', getAllReviews);
router.get('/facility/:facilityId', getByFacility);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
