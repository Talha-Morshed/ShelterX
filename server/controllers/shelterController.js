const shelterModel = require('../models/shelterModel');

const validateShelterInput = (data) => {
  const {
    shelter_name,
    shelter_type,
    address,
    city,
    phone,
    capacity,
    available_spaces,
    description,
    latitude,
    longitude,
  } = data;

  const errors = [];

  if (!shelter_name || !String(shelter_name).trim()) {
    errors.push('shelter_name is required');
  }
  if (!shelter_type || !String(shelter_type).trim()) {
    errors.push('shelter_type is required');
  }
  if (!address || !String(address).trim()) {
    errors.push('address is required');
  }
  if (!city || !String(city).trim()) {
    errors.push('city is required');
  }
  if (!capacity && capacity !== 0) {
    errors.push('capacity is required');
  }
  if (!available_spaces && available_spaces !== 0) {
    errors.push('available_spaces is required');
  }

  if (Number(capacity) < 0) {
    errors.push('capacity cannot be negative');
  }
  if (Number(available_spaces) < 0) {
    errors.push('available_spaces cannot be negative');
  }
  if (Number(available_spaces) > Number(capacity)) {
    errors.push('available_spaces cannot exceed capacity');
  }

  if (phone !== undefined && phone !== null && phone !== '' && !/^[0-9+()\-\s]+$/.test(phone)) {
    errors.push('phone format is invalid');
  }

  if (latitude !== undefined && latitude !== null && latitude !== '' && (Number(latitude) < -90 || Number(latitude) > 90)) {
    errors.push('latitude must be between -90 and 90');
  }

  if (longitude !== undefined && longitude !== null && longitude !== '' && (Number(longitude) < -180 || Number(longitude) > 180)) {
    errors.push('longitude must be between -180 and 180');
  }

  return errors;
};

const getAllShelters = async (req, res) => {
  try {
    const shelters = await shelterModel.getAllShelters();
    res.status(200).json(shelters);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shelters', error: error.message });
  }
};

const getShelterById = async (req, res) => {
  try {
    const { id } = req.params;
    const shelter = await shelterModel.getShelterById(id);

    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    return res.status(200).json(shelter);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch shelter', error: error.message });
  }
};

const createShelter = async (req, res) => {
  try {
    const errors = validateShelterInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const shelter = {
      ...req.body,
      capacity: Number(req.body.capacity),
      available_spaces: Number(req.body.available_spaces),
      latitude: req.body.latitude === '' || req.body.latitude === undefined || req.body.latitude === null ? null : Number(req.body.latitude),
      longitude: req.body.longitude === '' || req.body.longitude === undefined || req.body.longitude === null ? null : Number(req.body.longitude),
    };

    const shelterId = await shelterModel.createShelter(shelter);
    const createdShelter = await shelterModel.getShelterById(shelterId);

    return res.status(201).json({
      message: 'Shelter created successfully',
      shelter: createdShelter,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create shelter', error: error.message });
  }
};

const updateShelter = async (req, res) => {
  try {
    const { id } = req.params;
    const existingShelter = await shelterModel.getShelterById(id);

    if (!existingShelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    const errors = validateShelterInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const shelter = {
      ...existingShelter,
      ...req.body,
      capacity: Number(req.body.capacity),
      available_spaces: Number(req.body.available_spaces),
      latitude: req.body.latitude === '' || req.body.latitude === undefined || req.body.latitude === null ? null : Number(req.body.latitude),
      longitude: req.body.longitude === '' || req.body.longitude === undefined || req.body.longitude === null ? null : Number(req.body.longitude),
    };

    await shelterModel.updateShelter(id, shelter);
    const updatedShelter = await shelterModel.getShelterById(id);

    return res.status(200).json({
      message: 'Shelter updated successfully',
      shelter: updatedShelter,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update shelter', error: error.message });
  }
};

const deleteShelter = async (req, res) => {
  try {
    const { id } = req.params;
    const shelter = await shelterModel.getShelterById(id);

    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    await shelterModel.deleteShelter(id);
    return res.status(200).json({ message: 'Shelter deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete shelter', error: error.message });
  }
};

module.exports = {
  getAllShelters,
  getShelterById,
  createShelter,
  updateShelter,
  deleteShelter,
};
