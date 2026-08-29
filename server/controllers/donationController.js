const donationModel = require('../models/donationModel');

const validateDonationInput = (data) => {
  const { facility_id, user_id, amount } = data;
  const errors = [];
  if (!facility_id) errors.push('facility_id is required');
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

const getByFacility = async (req, res) => {
  try {
    const donations = await donationModel.getDonationsByFacility(req.params.facilityId);
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

const getFacilitiesAndDonations = async (req, res) => {
  try {
    const data = await donationModel.getFacilitiesAndDonations();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facilities and donations', error: error.message });
  }
};

// A- Controller for SUM aggregate: total donations per facility
const getFacilityDonationTotals = async (req, res) => {
  try {
    const data = await donationModel.getFacilityDonationTotals();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facility donation totals', error: error.message });
  }
};

// A- Controller for GROUP BY + HAVING: donation stats per facility with HAVING total_amount filter
const getDonationStatsHaving = async (req, res) => {
  try {
    const minTotal = Number(req.query.minTotal) || 100;
    const data = await donationModel.getDonationStatsHaving(minTotal);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donation stats HAVING', error: error.message });
  }
};

// ratri - Top donors by total donated
const getTopDonorsByTotalDonated = async (req, res) => {
  try {
    const data = await donationModel.getTopDonorsByTotalDonated();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch top donors by total donated', error: error.message });
  }
};

// ratri - Count distinct donors per facility
const getDistinctDonorsPerFacility = async (req, res) => {
  try {
    const data = await donationModel.getDistinctDonorsPerFacility();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch distinct donors per facility', error: error.message });
  }
};

// A- Controller for GROUP BY + HAVING: top donors HAVING total donated
const getTopDonorsHaving = async (req, res) => {
  try {
    const minTotal = Number(req.query.minTotal) || 100;
    const data = await donationModel.getTopDonorsHaving(minTotal);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch top donors HAVING', error: error.message });
  }
};

// A- Controller for Subquery: donations above average amount
const getDonationsAboveAverage = async (req, res) => {
  try {
    const data = await donationModel.getDonationsAboveAverage();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations subquery', error: error.message });
  }
};

// A- Controller for Subquery IN: donors to food_bank facilities
const getDonorsToFoodBankSubquery = async (req, res) => {
  try {
    const data = await donationModel.getDonorsToFoodBankSubquery();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donors subquery IN', error: error.message });
  }
};

module.exports = { getAllDonations, getByFacility, getById, create, update, remove, getFacilitiesAndDonations, getFacilityDonationTotals, getDonationStatsHaving, getTopDonorsByTotalDonated, getDistinctDonorsPerFacility, getTopDonorsHaving, getDonationsAboveAverage, getDonorsToFoodBankSubquery };
