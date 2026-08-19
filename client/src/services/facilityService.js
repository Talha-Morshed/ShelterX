const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get all facilities
 */
export const getFacilities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/facilities`);
    if (!response.ok) {
      throw new Error('Failed to fetch facilities');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};

/**
 * Get a single facility by ID
 */
export const getFacility = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/facilities/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Facility not found');
      }
      throw new Error('Failed to fetch facility');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching facility ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new facility
 */
export const createFacility = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/facilities`, {
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
    console.error('Error creating facility:', error);
    throw error;
  }
};

/**
 * Update an existing facility
 */
export const updateFacility = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/facilities/${id}`, {
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
    console.error(`Error updating facility ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a facility
 */
export const deleteFacility = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/facilities/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete facility');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting facility ${id}:`, error);
    throw error;
  }
};
