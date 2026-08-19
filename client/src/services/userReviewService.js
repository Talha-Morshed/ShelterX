const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getUsersWithReviews = async () => {
  const response = await fetch(`${API_BASE_URL}/users/with-reviews`);
  if (!response.ok) throw new Error('Failed to fetch');
  return await response.json();
};
