const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get all services
 */
export const getServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Get a single service by ID
 */
export const getService = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Service not found');
      }
      throw new Error('Failed to fetch service');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new service
 */
export const createService = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
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
    console.error('Error creating service:', error);
    throw error;
  }
};

/**
 * Update an existing service
 */
export const updateService = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
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
    console.error(`Error updating service ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a service
 */
export const deleteService = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete service');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting service ${id}:`, error);
    throw error;
  }
};
