import { getAuthHeaders } from './authHeaders';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get all volunteers
 */
export const getVolunteers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/volunteers`);
    if (!response.ok) {
      throw new Error('Failed to fetch volunteers');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    throw error;
  }
};

/**
 * Get volunteer applications for currently logged-in user
 */
export const getMyVolunteerApplications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/volunteers/my-applications`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch your volunteer applications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching my volunteer applications:', error);
    throw error;
  }
};

/**
 * Apply to be a volunteer at a facility (for logged-in user)
 */
export const applyAsVolunteer = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/volunteers/apply`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.errors ? errorData.errors.join(', ') : errorData.message;
      throw new Error(errorMessage || 'Failed to submit volunteer application');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting volunteer application:', error);
    throw error;
  }
};

/**
 * Create a new volunteer
 */
export const createVolunteer = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/volunteers`, {
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
    console.error('Error creating volunteer:', error);
    throw error;
  }
};

/**
 * Update an existing volunteer
 */
export const updateVolunteer = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
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
    console.error(`Error updating volunteer ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a volunteer
 */
export const deleteVolunteer = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete volunteer');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting volunteer ${id}:`, error);
    throw error;
  }
};
