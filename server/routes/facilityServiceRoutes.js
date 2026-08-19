const express = require('express');
const {
  getAllFacilityServices,
  getByFacility,
  getById,
  create,
  update,
  remove,
} = require('../controllers/facilityServiceController');

const router = express.Router();

router.get('/', getAllFacilityServices);
router.get('/facility/:facilityId', getByFacility);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
