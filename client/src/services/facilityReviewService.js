const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getFacilitiesWithReviews = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/with-reviews`);
  if (!response.ok) throw new Error('Failed to fetch');
  return await response.json();
};
