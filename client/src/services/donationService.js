const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get all donations
 */
export const getDonations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/donations`);
    if (!response.ok) {
      throw new Error('Failed to fetch donations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

/**
 * Create a new donation
 */
export const createDonation = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/donations`, {
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
    console.error('Error creating donation:', error);
    throw error;
  }
};

/**
 * Update an existing donation
 */
export const updateDonation = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/${id}`, {
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
    console.error(`Error updating donation ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a donation
 */
export const deleteDonation = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete donation');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting donation ${id}:`, error);
    throw error;
  }
};
