const express = require('express');
const {
  getAllReviews,
  getByFacility,
  getById,
  create,
  createForCurrentUser,
  update,
  remove,
  getHighRatedFacilitiesHaving,
  getActiveReviewersHaving,
  getReviewsAboveAvgRating,
  getUnreviewedFacilitiesSubquery,
} = require('../controllers/reviewController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// A- GROUP BY + HAVING routes for reviews
router.get('/stats/high-rated-having', getHighRatedFacilitiesHaving);
router.get('/stats/active-reviewers-having', getActiveReviewersHaving);
// A- Subquery routes for reviews
router.get('/stats/above-avg-subquery', getReviewsAboveAvgRating);
router.get('/stats/unreviewed-subquery', getUnreviewedFacilitiesSubquery);

router.get('/', getAllReviews);
router.get('/facility/:facilityId', getByFacility);
router.post('/facility/:facilityId', authenticate, authorizeRole('user'), createForCurrentUser);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
