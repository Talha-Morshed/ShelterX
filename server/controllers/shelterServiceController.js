const shelterServiceModel = require('../models/shelterServiceModel');

const validateInput = (data) => {
  const { shelter_id, service_id } = data;
  const errors = [];
  if (!shelter_id) errors.push('shelter_id is required');
  if (!service_id) errors.push('service_id is required');
  return errors;
};

const getAllShelterServices = async (req, res) => {
  try {
    const result = await shelterServiceModel.getAllShelterServices();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shelter services', error: error.message });
  }
};

const getByShelter = async (req, res) => {
  try {
    const result = await shelterServiceModel.getShelterServicesByShelter(req.params.shelterId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services for shelter', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const record = await shelterServiceModel.getShelterServiceById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch record', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const errors = validateInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const id = await shelterServiceModel.createShelterService(req.body);
    const record = await shelterServiceModel.getShelterServiceById(id);
    res.status(201).json({ message: 'Shelter service created successfully', record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create shelter service', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const existing = await shelterServiceModel.getShelterServiceById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Record not found' });

    const errors = validateInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    await shelterServiceModel.updateShelterService(req.params.id, req.body);
    const record = await shelterServiceModel.getShelterServiceById(req.params.id);
    res.status(200).json({ message: 'Shelter service updated successfully', record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update shelter service', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const existing = await shelterServiceModel.getShelterServiceById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Record not found' });

    await shelterServiceModel.deleteShelterService(req.params.id);
    res.status(200).json({ message: 'Shelter service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete shelter service', error: error.message });
  }
};

module.exports = { getAllShelterServices, getByShelter, getById, create, update, remove };
