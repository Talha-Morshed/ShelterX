const express = require('express');
const {
  getAllContacts,
  getByShelter,
  getById,
  create,
  update,
  remove,
} = require('../controllers/emergencyContactController');

const router = express.Router();

router.get('/', getAllContacts);
router.get('/shelter/:shelterId', getByShelter);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
