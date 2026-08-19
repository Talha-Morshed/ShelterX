const express = require('express');
const {
  getAllDonations,
  getByFacility,
  getById,
  create,
  update,
  remove,
  getFacilitiesAndDonations,
} = require('../controllers/donationController');

const router = express.Router();

router.get('/', getAllDonations);
router.get('/facilities-and-donations', getFacilitiesAndDonations);
router.get('/facility/:facilityId', getByFacility);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
