const express = require('express');
const {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
  getAllFacilitiesWithReviews,
  getFacilityReviewCounts,
  getFacilityAverageRatings,
  getFacilitiesHavingMinReviews,
  getFacilityTypeStatsHaving,
  getFacilityTypeCapacityTotals,
  getCitiesHavingManyFacilities,
  getFacilitiesAboveAvgCapacity,
  getFacilitiesWithDonationsSubquery,
  getFacilitiesWithFiveStarReviews,
} = require('../controllers/facilityController');

const router = express.Router();

// A- GROUP BY + HAVING routes: aggregation filters
router.get('/stats/review-counts', getFacilityReviewCounts);
router.get('/stats/avg-ratings', getFacilityAverageRatings);
router.get('/stats/having-reviews', getFacilitiesHavingMinReviews);
router.get('/stats/type-having', getFacilityTypeStatsHaving);
router.get('/stats/type-capacity-sum', getFacilityTypeCapacityTotals);
router.get('/stats/cities-having', getCitiesHavingManyFacilities);
// A- Subquery routes: scalar / IN / EXISTS examples
router.get('/stats/above-avg-capacity', getFacilitiesAboveAvgCapacity);
router.get('/stats/with-donations-subquery', getFacilitiesWithDonationsSubquery);
router.get('/stats/five-star-subquery', getFacilitiesWithFiveStarReviews);

router.get('/', getAllFacilities);
router.get('/with-reviews', getAllFacilitiesWithReviews);
router.get('/:id', getFacilityById);
router.post('/', createFacility);
router.put('/:id', updateFacility);
router.delete('/:id', deleteFacility);

module.exports = router;
