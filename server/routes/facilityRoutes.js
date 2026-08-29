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
  getFacilityTypeAverageCapacity,
  getFacilitiesCountPerCity,
  getFacilityTypeCapacityRange,
  getCitiesHavingManyFacilities,
  getFacilitiesAboveAvgCapacity,
  getFacilitiesWithDonationsSubquery,
  getFacilitiesWithFiveStarReviews,
  getFacilitiesWithoutEmergencyContactsSubquery,
  getFacilitiesAboveAvgAvailableSpaces,
  getFacilitiesAboveAvgServiceCountSubquery,
} = require('../controllers/facilityController');

const router = express.Router();

// A- GROUP BY + HAVING routes: aggregation filters
router.get('/stats/review-counts', getFacilityReviewCounts);
router.get('/stats/avg-ratings', getFacilityAverageRatings);
router.get('/stats/having-reviews', getFacilitiesHavingMinReviews);
router.get('/stats/type-having', getFacilityTypeStatsHaving);
router.get('/stats/type-capacity-sum', getFacilityTypeCapacityTotals);
router.get('/stats/type-capacity-avg', getFacilityTypeAverageCapacity);
router.get('/stats/city-facility-count', getFacilitiesCountPerCity);
router.get('/stats/type-capacity-range', getFacilityTypeCapacityRange);
router.get('/stats/cities-having', getCitiesHavingManyFacilities);
// A- Subquery routes: scalar / IN / EXISTS examples
router.get('/stats/above-avg-capacity', getFacilitiesAboveAvgCapacity);
router.get('/stats/with-donations-subquery', getFacilitiesWithDonationsSubquery);
router.get('/stats/five-star-subquery', getFacilitiesWithFiveStarReviews);
router.get('/stats/without-emergency-contacts-subquery', getFacilitiesWithoutEmergencyContactsSubquery);
router.get('/stats/above-avg-available-spaces-subquery', getFacilitiesAboveAvgAvailableSpaces);
router.get('/stats/above-avg-service-count-subquery', getFacilitiesAboveAvgServiceCountSubquery);

router.get('/', getAllFacilities);
router.get('/with-reviews', getAllFacilitiesWithReviews);
router.get('/:id', getFacilityById);
router.post('/', createFacility);
router.put('/:id', updateFacility);
router.delete('/:id', deleteFacility);

module.exports = router;
