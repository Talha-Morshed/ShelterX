// Adnan - Return the current bearer token header for protected API requests.
export const getAuthHeaders = () => {
  const token = localStorage.getItem('shelterx-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};