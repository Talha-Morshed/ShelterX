const express = require('express');
const {
  getAllVolunteers,
  getByFacility,
  getById,
  create,
  update,
  remove,
} = require('../controllers/volunteerController');

const router = express.Router();

router.get('/', getAllVolunteers);
router.get('/facility/:facilityId', getByFacility);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
