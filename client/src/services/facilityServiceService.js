const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get all facility services
 */
export const getFacilityServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/facility-services`);
    if (!response.ok) {
      throw new Error('Failed to fetch facility services');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching facility services:', error);
    throw error;
  }
};

/**
 * Get a single facility service by ID
 */
export const getFacilityService = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/facility-services/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Facility service not found');
      }
      throw new Error('Failed to fetch facility service');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching facility service ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new facility service
 */
export const createFacilityService = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/facility-services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.errors ? errorData.errors.join(', ') : errorData.message;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating facility service:', error);
    throw error;
  }
};

/**
 * Update an existing facility service
 */
export const updateFacilityService = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/facility-services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.errors ? errorData.errors.join(', ') : errorData.message;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating facility service ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a facility service
 */
export const deleteFacilityService = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/facility-services/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete facility service');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting facility service ${id}:`, error);
    throw error;
  }
};
