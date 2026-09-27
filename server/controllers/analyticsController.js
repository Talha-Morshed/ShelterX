const analyticsModel = require('../models/analyticsModel');

// Adnan - Return rows from the facility overview SQL view.
const getFacilityOverviewView = async (req, res) => {
  try {
    const data = await analyticsModel.getFacilityOverviewView();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facility overview view', error: error.message });
  }
};

// Adnan - Return rows from the service availability SQL view.
const getServiceAvailabilityView = async (req, res) => {
  try {
    const data = await analyticsModel.getServiceAvailabilityView();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch service availability view', error: error.message });
  }
};

// Adnan - Return public facility rows from the sanitized SQL view.
const getPublicFacilityDirectoryView = async (req, res) => {
  try {
    const data = await analyticsModel.getPublicFacilityDirectoryView();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch public facility directory view', error: error.message });
  }
};

// Adnan - Execute the minimum-capacity stored procedure using a safe numeric parameter.
const getFacilitiesByMinCapacityProcedure = async (req, res) => {
  try {
    const minCapacity = Math.max(0, Number(req.query.minCapacity) || 50);
    const data = await analyticsModel.getFacilitiesByMinCapacityProcedure(minCapacity);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to execute minimum capacity procedure', error: error.message });
  }
};

// Adnan - Execute the facility activity stored procedure using an optional city filter.
const getFacilityActivityProcedure = async (req, res) => {
  try {
    const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';
    const data = await analyticsModel.getFacilityActivityProcedure(city);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to execute facility activity procedure', error: error.message });
  }
};

// Adnan - Execute the conditional capacity procedure using a safe numeric parameter.
const getFacilityCapacityStatusProcedure = async (req, res) => {
  try {
    const minCapacity = Math.max(0, Number(req.query.minCapacity) || 0);
    const data = await analyticsModel.getFacilityCapacityStatusProcedure(minCapacity);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to execute capacity status procedure', error: error.message });
  }
};

// Adnan - Execute the loop procedure that returns capacity-band counts.
const getFacilityCapacityBandsProcedure = async (req, res) => {
  try {
    const data = await analyticsModel.getFacilityCapacityBandsProcedure();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to execute capacity bands procedure', error: error.message });
  }
};

module.exports = {
  getFacilityOverviewView,
  getServiceAvailabilityView,
  getPublicFacilityDirectoryView,
  getFacilitiesByMinCapacityProcedure,
  getFacilityActivityProcedure,
  getFacilityCapacityStatusProcedure,
  getFacilityCapacityBandsProcedure,
};