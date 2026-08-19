const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get all emergency contacts
 */
export const getEmergencyContacts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/emergency-contacts`);
    if (!response.ok) {
      throw new Error('Failed to fetch emergency contacts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    throw error;
  }
};

/**
 * Get a single emergency contact by ID
 */
export const getEmergencyContact = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emergency-contacts/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Emergency contact not found');
      }
      throw new Error('Failed to fetch emergency contact');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching emergency contact ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new emergency contact
 */
export const createEmergencyContact = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emergency-contacts`, {
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
    console.error('Error creating emergency contact:', error);
    throw error;
  }
};

/**
 * Update an existing emergency contact
 */
export const updateEmergencyContact = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emergency-contacts/${id}`, {
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
    console.error(`Error updating emergency contact ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an emergency contact
 */
export const deleteEmergencyContact = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/emergency-contacts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete emergency contact');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting emergency contact ${id}:`, error);
    throw error;
  }
};
