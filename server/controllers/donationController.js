const donationModel = require('../models/donationModel');

const validateDonationInput = (data) => {
  const { shelter_id, user_id, amount } = data;
  const errors = [];
  if (!shelter_id) errors.push('shelter_id is required');
  if (!user_id) errors.push('user_id is required');
  if (amount === undefined || amount === null || Number(amount) < 0) errors.push('amount is required and must be non-negative');
  return errors;
};

const getAllDonations = async (req, res) => {
  try {
    const donations = await donationModel.getAllDonations();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations', error: error.message });
  }
};

const getByShelter = async (req, res) => {
  try {
    const donations = await donationModel.getDonationsByShelter(req.params.shelterId);
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const donation = await donationModel.getDonationById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donation', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const errors = validateDonationInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const donationId = await donationModel.createDonation(req.body);
    const donation = await donationModel.getDonationById(donationId);
    res.status(201).json({ message: 'Donation created successfully', donation });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create donation', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const existing = await donationModel.getDonationById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Donation not found' });

    const errors = validateDonationInput(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    await donationModel.updateDonation(req.params.id, req.body);
    const donation = await donationModel.getDonationById(req.params.id);
    res.status(200).json({ message: 'Donation updated successfully', donation });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update donation', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const existing = await donationModel.getDonationById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Donation not found' });

    await donationModel.deleteDonation(req.params.id);
    res.status(200).json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete donation', error: error.message });
  }
};

module.exports = { getAllDonations, getByShelter, getById, create, update, remove };
