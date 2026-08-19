const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getFacilitiesAndDonations = async () => {
  const response = await fetch(`${API_BASE_URL}/donations/facilities-and-donations`);
  if (!response.ok) throw new Error('Failed to fetch');
  return await response.json();
};
