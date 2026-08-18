const serviceModel = require('../models/serviceModel');

const validateServiceInput = (data) => {
  const { service_name } = data;
  const errors = [];
  if (!service_name || !String(service_name).trim()) errors.push('service_name is required');
  return errors;
};

const getAllServices = async (req, res) => {
  try {
    const services = await serviceModel.getAllServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services', error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await serviceModel.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch service', error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const errors = validateServiceInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const serviceId = await serviceModel.createService(req.body);
    const service = await serviceModel.getServiceById(serviceId);
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create service', error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const existing = await serviceModel.getServiceById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Service not found' });

    const errors = validateServiceInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    await serviceModel.updateService(req.params.id, req.body);
    const service = await serviceModel.getServiceById(req.params.id);
    res.status(200).json({ message: 'Service updated successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update service', error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const existing = await serviceModel.getServiceById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Service not found' });

    await serviceModel.deleteService(req.params.id);
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete service', error: error.message });
  }
};

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService };
