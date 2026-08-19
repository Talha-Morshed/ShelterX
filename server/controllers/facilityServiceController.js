const facilityServiceModel = require('../models/facilityServiceModel');

const validateInput = (data) => {
  const { facility_id, service_id } = data;
  const errors = [];
  if (!facility_id) errors.push('facility_id is required');
  if (!service_id) errors.push('service_id is required');
  return errors;
};

const getAllFacilityServices = async (req, res) => {
  try {
    const result = await facilityServiceModel.getAllFacilityServices();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facility services', error: error.message });
  }
};

const getByFacility = async (req, res) => {
  try {
    const result = await facilityServiceModel.getShelterServicesByShelter(req.params.facilityId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services for facility', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const record = await facilityServiceModel.getShelterServiceById(req.params.id);
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

    const id = await facilityServiceModel.createShelterService(req.body);
    const record = await facilityServiceModel.getShelterServiceById(id);
    res.status(201).json({ message: 'Facility service created successfully', record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create facility service', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const existing = await facilityServiceModel.getShelterServiceById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Record not found' });

    const errors = validateInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    await facilityServiceModel.updateShelterService(req.params.id, req.body);
    const record = await facilityServiceModel.getShelterServiceById(req.params.id);
    res.status(200).json({ message: 'Facility service updated successfully', record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update facility service', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const existing = await facilityServiceModel.getShelterServiceById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Record not found' });

    await facilityServiceModel.deleteShelterService(req.params.id);
    res.status(200).json({ message: 'Facility service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete facility service', error: error.message });
  }
};

module.exports = { getAllFacilityServices, getByFacility, getById, create, update, remove };
