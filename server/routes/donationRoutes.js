const express = require('express');
const {
  getAllDonations,
  getByFacility,
  getById,
  create,
  update,
  remove,
  getFacilitiesAndDonations,
  getDonationStatsHaving,
  getTopDonorsHaving,
  getDonationsAboveAverage,
  getDonorsToFoodBankSubquery,
} = require('../controllers/donationController');

const router = express.Router();

// A- GROUP BY + HAVING routes for donation analytics
router.get('/stats/donation-stats-having', getDonationStatsHaving);
router.get('/stats/top-donors-having', getTopDonorsHaving);
// A- Subquery routes for donations
router.get('/stats/above-avg-subquery', getDonationsAboveAverage);
router.get('/stats/foodbank-donors-subquery', getDonorsToFoodBankSubquery);

router.get('/', getAllDonations);
router.get('/facilities-and-donations', getFacilitiesAndDonations);
router.get('/facility/:facilityId', getByFacility);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
