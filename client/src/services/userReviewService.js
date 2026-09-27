const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
import { getAuthHeaders } from './authHeaders';

export const getUsersWithReviews = async () => {
  const response = await fetch(`${API_BASE_URL}/users/with-reviews`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch users with reviews (${response.status})`);
  }
  return await response.json();
};
