const facilityModel = require('../models/facilityModel');

const validateFacilityInput = (data) => {
  const {
    facility_name,
    facility_type,
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

  if (!facility_name || !String(facility_name).trim()) {
    errors.push('facility_name is required');
  }
  if (!facility_type || !String(facility_type).trim()) {
    errors.push('facility_type is required');
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

const getAllFacilities = async (req, res) => {
  try {
    const facilities = await facilityModel.getAllFacilities();
    res.status(200).json(facilities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facilities', error: error.message });
  }
};

const getFacilityById = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await facilityModel.getFacilityById(id);

    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    return res.status(200).json(facility);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch facility', error: error.message });
  }
};

const createFacility = async (req, res) => {
  try {
    const errors = validateFacilityInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const facility = {
      facility_name: req.body.facility_name,
      facility_type: req.body.facility_type,
      address: req.body.address,
      city: req.body.city,
      phone: req.body.phone || null,
      capacity: Number(req.body.capacity),
      available_spaces: Number(req.body.available_spaces),
      description: req.body.description || null,
      latitude: req.body.latitude === '' || req.body.latitude === undefined || req.body.latitude === null ? null : Number(req.body.latitude),
      longitude: req.body.longitude === '' || req.body.longitude === undefined || req.body.longitude === null ? null : Number(req.body.longitude),
    };

    const facilityId = await facilityModel.createFacility(facility);
    const createdFacility = await facilityModel.getFacilityById(facilityId);

    return res.status(201).json({
      message: 'Facility created successfully',
      facility: createdFacility,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create facility', error: error.message });
  }
};

const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const existingFacility = await facilityModel.getFacilityById(id);

    if (!existingFacility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    const errors = validateFacilityInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const facility = {
      facility_name: req.body.facility_name,
      facility_type: req.body.facility_type,
      address: req.body.address,
      city: req.body.city,
      phone: req.body.phone || null,
      capacity: Number(req.body.capacity),
      available_spaces: Number(req.body.available_spaces),
      description: req.body.description || null,
      latitude: req.body.latitude === '' || req.body.latitude === undefined || req.body.latitude === null ? null : Number(req.body.latitude),
      longitude: req.body.longitude === '' || req.body.longitude === undefined || req.body.longitude === null ? null : Number(req.body.longitude),
    };

    await facilityModel.updateFacility(id, facility);
    const updatedFacility = await facilityModel.getFacilityById(id);

    return res.status(200).json({
      message: 'Facility updated successfully',
      facility: updatedFacility,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update facility', error: error.message });
  }
};

const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await facilityModel.getFacilityById(id);

    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    await facilityModel.deleteFacility(id);
    return res.status(200).json({ message: 'Facility deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete facility', error: error.message });
  }
};

const getAllFacilitiesWithReviews = async (req, res) => {
  try {
    const facilities = await facilityModel.getFacilitiesWithReviews();
    res.status(200).json(facilities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facilities with reviews', error: error.message });
  }
};

// Talha - Controller for COUNT aggregate: review count per facility
const getFacilityReviewCounts = async (req, res) => {
  try {
    const data = await facilityModel.getFacilityReviewCounts();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facility review counts', error: error.message });
  }
};

// Talha - Controller for AVG aggregate: average rating per facility
const getFacilityAverageRatings = async (req, res) => {
  try {
    const data = await facilityModel.getFacilityAverageRatings();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facility average ratings', error: error.message });
  }
};

// Talha - Controller for GROUP BY + HAVING: facilities having minimum reviews
const getFacilitiesHavingMinReviews = async (req, res) => {
  try {
    const min = Number(req.query.min) || 1;
    const data = await facilityModel.getFacilitiesHavingMinReviews(min);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facilities HAVING min reviews', error: error.message });
  }
};

// Talha - Controller for GROUP BY + HAVING: facility type stats with HAVING total_capacity filter
const getFacilityTypeStatsHaving = async (req, res) => {
  try {
    const minCapacity = Number(req.query.minCapacity) || 0;
    const data = await facilityModel.getFacilityTypeStatsHaving(minCapacity);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facility type stats', error: error.message });
  }
};

// ratri
const getFacilityTypeCapacityTotals = async (req, res) => {
  try {
    const data = await facilityModel.getFacilityTypeCapacityTotals();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total capacity by facility type', error: error.message });
  }
};

// A- Controller for GROUP BY + HAVING: cities having many facilities
const getCitiesHavingManyFacilities = async (req, res) => {
  try {
    const min = Number(req.query.min) || 2;
    const data = await facilityModel.getCitiesHavingManyFacilities(min);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cities HAVING', error: error.message });
  }
};

// A- Controller for Subquery: facilities above average capacity
const getFacilitiesAboveAvgCapacity = async (req, res) => {
  try {
    const data = await facilityModel.getFacilitiesAboveAvgCapacity();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facilities subquery', error: error.message });
  }
};

// A- Controller for Subquery IN: facilities with donations
const getFacilitiesWithDonationsSubquery = async (req, res) => {
  try {
    const data = await facilityModel.getFacilitiesWithDonationsSubquery();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facilities subquery IN', error: error.message });
  }
};

// A- Controller for Subquery EXISTS: facilities with 5-star reviews
const getFacilitiesWithFiveStarReviews = async (req, res) => {
  try {
    const data = await facilityModel.getFacilitiesWithFiveStarReviews();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch 5-star facilities', error: error.message });
  }
};

module.exports = {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
  getAllFacilitiesWithReviews,
  getFacilityReviewCounts,
  getFacilityAverageRatings,
  getFacilitiesHavingMinReviews,
  getFacilityTypeStatsHaving,
  getFacilityTypeCapacityTotals,
  getCitiesHavingManyFacilities,
  getFacilitiesAboveAvgCapacity,
  getFacilitiesWithDonationsSubquery,
  getFacilitiesWithFiveStarReviews,
};
