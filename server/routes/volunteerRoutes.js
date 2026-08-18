const express = require('express');
const {
  getAllVolunteers,
  getByShelter,
  getById,
  create,
  update,
  remove,
} = require('../controllers/volunteerController');

const router = express.Router();

router.get('/', getAllVolunteers);
router.get('/shelter/:shelterId', getByShelter);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
