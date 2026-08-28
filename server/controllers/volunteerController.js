const volunteerModel = require('../models/volunteerModel');

const validateVolunteerInput = (data) => {
  const { facility_id, user_id } = data;
  const errors = [];
  if (!facility_id) errors.push('facility_id is required');
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

const getByFacility = async (req, res) => {
  try {
    const volunteers = await volunteerModel.getVolunteersByFacility(req.params.facilityId);
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

// A- Controller for GROUP BY + HAVING: facilities with min volunteers
const getFacilitiesWithMinVolunteersHaving = async (req, res) => {
  try {
    const min = Number(req.query.min) || 1;
    const data = await volunteerModel.getFacilitiesWithMinVolunteersHaving(min);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch volunteer HAVING', error: error.message });
  }
};

// A- Controller for GROUP BY + HAVING: volunteer status stats
const getVolunteerStatusStatsHaving = async (req, res) => {
  try {
    const min = Number(req.query.min) || 1;
    const data = await volunteerModel.getVolunteerStatusStatsHaving(min);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch volunteer status HAVING', error: error.message });
  }
};

// A- Controller for Subquery: volunteers who are also donors
const getVolunteersWhoAreDonorsSubquery = async (req, res) => {
  try {
    const data = await volunteerModel.getVolunteersWhoAreDonorsSubquery();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch volunteers subquery', error: error.message });
  }
};

// A- Controller for Subquery: facilities above average volunteer count
const getFacilitiesAboveAvgVolunteersSubquery = async (req, res) => {
  try {
    const data = await volunteerModel.getFacilitiesAboveAvgVolunteersSubquery();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch avg volunteers subquery', error: error.message });
  }
};

module.exports = { getAllVolunteers, getByFacility, getById, create, update, remove, getFacilitiesWithMinVolunteersHaving, getVolunteerStatusStatsHaving, getVolunteersWhoAreDonorsSubquery, getFacilitiesAboveAvgVolunteersSubquery };
