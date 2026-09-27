import { getAuthHeaders } from './authHeaders';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get all reviews
 */
export const getReviews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const getReviewsByFacility = async (facilityId) => {
  const response = await fetch(`${API_BASE_URL}/reviews/facility/${facilityId}`);
  if (!response.ok) throw new Error('Failed to load facility reviews');
  return response.json();
};

export const createFacilityReview = async (facilityId, data) => {
  const response = await fetch(`${API_BASE_URL}/reviews/facility/${facilityId}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit review');
  }

  return response.json();
};

/**
 * Create a new review
 */
export const createReview = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
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
    console.error('Error creating review:', error);
    throw error;
  }
};

/**
 * Update an existing review
 */
export const updateReview = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
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
    console.error(`Error updating review ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a review
 */
export const deleteReview = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete review');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting review ${id}:`, error);
    throw error;
  }
};
