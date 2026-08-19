const express = require('express');
const {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
} = require('../controllers/facilityController');

const router = express.Router();

router.get('/', getAllFacilities);
router.get('/:id', getFacilityById);
router.post('/', createFacility);
router.put('/:id', updateFacility);
router.delete('/:id', deleteFacility);

module.exports = router;
