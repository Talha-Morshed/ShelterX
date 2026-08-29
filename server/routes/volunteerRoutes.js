const express = require('express');
const {
  getAllVolunteers,
  getByFacility,
  getById,
  create,
  update,
  remove,
  getFacilityVolunteerCounts,
  getFacilitiesWithMinVolunteersHaving,
  getVolunteerStatusStatsHaving,
  getVolunteersWhoAreDonorsSubquery,
  getFacilitiesAboveAvgVolunteersSubquery,
} = require('../controllers/volunteerController');

const router = express.Router();

// A- GROUP BY + HAVING routes for volunteers
router.get('/stats/volunteer-counts', getFacilityVolunteerCounts);
router.get('/stats/facilities-min-volunteers-having', getFacilitiesWithMinVolunteersHaving);
router.get('/stats/status-having', getVolunteerStatusStatsHaving);
// A- Subquery routes for volunteers
router.get('/stats/volunteer-donors-subquery', getVolunteersWhoAreDonorsSubquery);
router.get('/stats/above-avg-volunteers-subquery', getFacilitiesAboveAvgVolunteersSubquery);

router.get('/', getAllVolunteers);
router.get('/facility/:facilityId', getByFacility);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
