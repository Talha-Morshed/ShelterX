const volunteerModel = require('../models/volunteerModel');

const validateVolunteerInput = (data) => {
  const { shelter_id, user_id } = data;
  const errors = [];
  if (!shelter_id) errors.push('shelter_id is required');
  if (!user_id) errors.push('user_id is required');
  return errors;
};

const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await volunteerModel.getAllVolunteers();
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch volunteers', error: error.message });
  }
};

const getByShelter = async (req, res) => {
  try {
    const volunteers = await volunteerModel.getVolunteersByShelter(req.params.shelterId);
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch volunteers', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const volunteer = await volunteerModel.getVolunteerById(req.params.id);
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.status(200).json(volunteer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch volunteer', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const errors = validateVolunteerInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const volunteerId = await volunteerModel.createVolunteer(req.body);
    const volunteer = await volunteerModel.getVolunteerById(volunteerId);
    res.status(201).json({ message: 'Volunteer created successfully', volunteer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create volunteer', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const existing = await volunteerModel.getVolunteerById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Volunteer not found' });

    const errors = validateVolunteerInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    await volunteerModel.updateVolunteer(req.params.id, req.body);
    const volunteer = await volunteerModel.getVolunteerById(req.params.id);
    res.status(200).json({ message: 'Volunteer updated successfully', volunteer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update volunteer', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const existing = await volunteerModel.getVolunteerById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Volunteer not found' });

    await volunteerModel.deleteVolunteer(req.params.id);
    res.status(200).json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete volunteer', error: error.message });
  }
};

module.exports = { getAllVolunteers, getByShelter, getById, create, update, remove };
