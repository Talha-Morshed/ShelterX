const express = require('express');
const {
  getFacilityOverviewView,
  getServiceAvailabilityView,
  getDonationTypeStatisticsView,
  getFacilityServiceSummaryView,
  getPublicFacilityDirectoryView,
  getFacilitiesByMinCapacityProcedure,
  getFacilityActivityProcedure,
  getFacilityCapacityStatusProcedure,
  getFacilityCapacityBandsProcedure,
} = require('../controllers/analyticsController');

const router = express.Router();

// Adnan - Expose read-only SQL view and stored procedure reports to the admin dashboard.
router.get('/views/facility-overview', getFacilityOverviewView);
router.get('/views/service-availability', getServiceAvailabilityView);
router.get('/views/donation-type-statistics', getDonationTypeStatisticsView);
router.get('/views/facility-service-summary', getFacilityServiceSummaryView);
router.get('/views/public-facility-directory', getPublicFacilityDirectoryView);
router.get('/procedures/facilities-by-min-capacity', getFacilitiesByMinCapacityProcedure);
router.get('/procedures/facility-activity', getFacilityActivityProcedure);
router.get('/procedures/facility-capacity-status', getFacilityCapacityStatusProcedure);
router.get('/procedures/facility-capacity-bands', getFacilityCapacityBandsProcedure);

module.exports = router;