const express = require('express');
const {
  getAllShelters,
  getShelterById,
  createShelter,
  updateShelter,
  deleteShelter,
} = require('../controllers/shelterController');

const router = express.Router();

router.get('/', getAllShelters);
router.get('/:id', getShelterById);
router.post('/', createShelter);
router.put('/:id', updateShelter);
router.delete('/:id', deleteShelter);

module.exports = router;
