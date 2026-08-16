const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get all shelters
 */
export const getShelters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shelters`);
    if (!response.ok) {
      throw new Error('Failed to fetch shelters');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching shelters:', error);
    throw error;
  }
};

/**
 * Get a single shelter by ID
 */
export const getShelter = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shelters/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Shelter not found');
      }
      throw new Error('Failed to fetch shelter');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching shelter ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new shelter
 */
export const createShelter = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shelters`, {
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
    console.error('Error creating shelter:', error);
    throw error;
  }
};

/**
 * Update an existing shelter
 */
export const updateShelter = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shelters/${id}`, {
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
    console.error(`Error updating shelter ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a shelter
 */
export const deleteShelter = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shelters/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete shelter');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting shelter ${id}:`, error);
    throw error;
  }
};
