const express = require('express');
const {
  getAllShelterServices,
  getByShelter,
  getById,
  create,
  update,
  remove,
} = require('../controllers/shelterServiceController');

const router = express.Router();

router.get('/', getAllShelterServices);
router.get('/shelter/:shelterId', getByShelter);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
