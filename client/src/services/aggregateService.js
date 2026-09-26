const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * adnan - Aggregate Service: Centralized API calls for GROUP BY, HAVING, and Subquery endpoints
 * Provides all statistical/analytical queries for the Admin Analytics Dashboard
 */

// ============================================================
// FACILITY AGGREGATES (GROUP BY + HAVING)
// ============================================================

/**
 * adnan - Get review count per facility (COUNT aggregate)
 * Endpoint: GET /api/facilities/stats/review-counts
 */
export const getFacilityReviewCounts = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/review-counts`);
  if (!response.ok) throw new Error('Failed to fetch facility review counts');
  return await response.json();
};

/**
 * adnan - Get average rating per facility (AVG aggregate)
 * Endpoint: GET /api/facilities/stats/avg-ratings
 */
export const getFacilityAverageRatings = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/avg-ratings`);
  if (!response.ok) throw new Error('Failed to fetch facility average ratings');
  return await response.json();
};

/**
 * adnan - Get facilities having minimum reviews (GROUP BY + HAVING)
 * Endpoint: GET /api/facilities/stats/having-reviews?min=2
 */
export const getFacilitiesHavingMinReviews = async (min = 2) => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/having-reviews?min=${min}`);
  if (!response.ok) throw new Error('Failed to fetch facilities having min reviews');
  return await response.json();
};

/**
 * adnan - Get facility type stats with HAVING total_capacity filter (GROUP BY + HAVING)
 * Endpoint: GET /api/facilities/stats/type-having?minCapacity=100
 */
export const getFacilityTypeStatsHaving = async (minCapacity = 100) => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/type-having?minCapacity=${minCapacity}`);
  if (!response.ok) throw new Error('Failed to fetch facility type stats');
  return await response.json();
};

/**
 * adnan - Get total capacity by facility type (SUM aggregate)
 * Endpoint: GET /api/facilities/stats/type-capacity-sum
 */
export const getFacilityTypeCapacityTotals = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/type-capacity-sum`);
  if (!response.ok) throw new Error('Failed to fetch facility type capacity totals');
  return await response.json();
};

/**
 * adnan - Get average capacity by facility type (AVG aggregate)
 * Endpoint: GET /api/facilities/stats/type-capacity-avg
 */
export const getFacilityTypeAverageCapacity = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/type-capacity-avg`);
  if (!response.ok) throw new Error('Failed to fetch facility type average capacity');
  return await response.json();
};

/**
 * adnan - Get facility count per city (COUNT aggregate)
 * Endpoint: GET /api/facilities/stats/city-facility-count
 */
export const getFacilitiesCountPerCity = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/city-facility-count`);
  if (!response.ok) throw new Error('Failed to fetch facility count per city');
  return await response.json();
};

/**
 * adnan - Get min/max capacity by facility type (MIN/MAX aggregates)
 * Endpoint: GET /api/facilities/stats/type-capacity-range
 */
export const getFacilityTypeCapacityRange = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/type-capacity-range`);
  if (!response.ok) throw new Error('Failed to fetch facility type capacity range');
  return await response.json();
};

/**
 * adnan - Get cities having many facilities (GROUP BY + HAVING)
 * Endpoint: GET /api/facilities/stats/cities-having?min=2
 */
export const getCitiesHavingManyFacilities = async (min = 2) => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/cities-having?min=${min}`);
  if (!response.ok) throw new Error('Failed to fetch cities having many facilities');
  return await response.json();
};

// ============================================================
// FACILITY SUBQUERIES
// ============================================================

/**
 * adnan - Get facilities with capacity above average (scalar subquery)
 * Endpoint: GET /api/facilities/stats/above-avg-capacity
 */
export const getFacilitiesAboveAvgCapacity = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/above-avg-capacity`);
  if (!response.ok) throw new Error('Failed to fetch facilities above avg capacity');
  return await response.json();
};

/**
 * adnan - Get facilities with donations (IN subquery)
 * Endpoint: GET /api/facilities/stats/with-donations-subquery
 */
export const getFacilitiesWithDonationsSubquery = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/with-donations-subquery`);
  if (!response.ok) throw new Error('Failed to fetch facilities with donations subquery');
  return await response.json();
};

/**
 * adnan - Get facilities with 5-star reviews (EXISTS subquery)
 * Endpoint: GET /api/facilities/stats/five-star-subquery
 */
export const getFacilitiesWithFiveStarReviews = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/five-star-subquery`);
  if (!response.ok) throw new Error('Failed to fetch facilities with 5-star reviews');
  return await response.json();
};

/**
 * adnan - Get facilities without emergency contacts (NOT EXISTS subquery)
 * Endpoint: GET /api/facilities/stats/without-emergency-contacts-subquery
 */
export const getFacilitiesWithoutEmergencyContactsSubquery = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/without-emergency-contacts-subquery`);
  if (!response.ok) throw new Error('Failed to fetch facilities without emergency contacts');
  return await response.json();
};

/**
 * adnan - Get facilities with available spaces above average (scalar subquery)
 * Endpoint: GET /api/facilities/stats/above-avg-available-spaces-subquery
 */
export const getFacilitiesAboveAvgAvailableSpaces = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/above-avg-available-spaces-subquery`);
  if (!response.ok) throw new Error('Failed to fetch facilities above avg available spaces');
  return await response.json();
};

/**
 * adnan - Get facilities with service count above average (derived-table subquery)
 * Endpoint: GET /api/facilities/stats/above-avg-service-count-subquery
 */
export const getFacilitiesAboveAvgServiceCountSubquery = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities/stats/above-avg-service-count-subquery`);
  if (!response.ok) throw new Error('Failed to fetch facilities above avg service count');
  return await response.json();
};

// ============================================================
// REVIEW AGGREGATES (GROUP BY + HAVING)
// ============================================================

/**
 * adnan - Get high-rated facilities with minimum reviews (GROUP BY + HAVING)
 * Endpoint: GET /api/reviews/stats/high-rated-having
 */
export const getHighRatedFacilitiesHaving = async () => {
  const response = await fetch(`${API_BASE_URL}/reviews/stats/high-rated-having`);
  if (!response.ok) throw new Error('Failed to fetch high-rated facilities');
  return await response.json();
};

/**
 * adnan - Get active reviewers with many reviews (GROUP BY + HAVING)
 * Endpoint: GET /api/reviews/stats/active-reviewers-having
 */
export const getActiveReviewersHaving = async () => {
  const response = await fetch(`${API_BASE_URL}/reviews/stats/active-reviewers-having`);
  if (!response.ok) throw new Error('Failed to fetch active reviewers');
  return await response.json();
};

/**
 * adnan - Get reviews with rating above average (scalar subquery)
 * Endpoint: GET /api/reviews/stats/above-avg-subquery
 */
export const getReviewsAboveAvgRating = async () => {
  const response = await fetch(`${API_BASE_URL}/reviews/stats/above-avg-subquery`);
  if (!response.ok) throw new Error('Failed to fetch reviews above avg rating');
  return await response.json();
};

/**
 * adnan - Get unreviewed facilities (NOT IN subquery)
 * Endpoint: GET /api/reviews/stats/unreviewed-subquery
 */
export const getUnreviewedFacilitiesSubquery = async () => {
  const response = await fetch(`${API_BASE_URL}/reviews/stats/unreviewed-subquery`);
  if (!response.ok) throw new Error('Failed to fetch unreviewed facilities');
  return await response.json();
};

// ============================================================
// DONATION AGGREGATES (GROUP BY + HAVING)
// ============================================================

/**
 * adnan - Get total donations per facility (SUM aggregate)
 * Endpoint: GET /api/donations/stats/donation-totals
 */
export const getFacilityDonationTotals = async () => {
  const response = await fetch(`${API_BASE_URL}/donations/stats/donation-totals`);
  if (!response.ok) throw new Error('Failed to fetch facility donation totals');
  return await response.json();
};

/**
 * adnan - Get donation stats per facility with HAVING filter (GROUP BY + HAVING)
 * Endpoint: GET /api/donations/stats/donation-stats-having
 */
export const getDonationStatsHaving = async () => {
  const response = await fetch(`${API_BASE_URL}/donations/stats/donation-stats-having`);
  if (!response.ok) throw new Error('Failed to fetch donation stats having');
  return await response.json();
};

/**
 * adnan - Get top donors by total donated (SUM + ORDER BY)
 * Endpoint: GET /api/donations/stats/top-donors-total
 */
export const getTopDonorsByTotalDonated = async () => {
  const response = await fetch(`${API_BASE_URL}/donations/stats/top-donors-total`);
  if (!response.ok) throw new Error('Failed to fetch top donors');
  return await response.json();
};

/**
 * adnan - Get distinct donors per facility (COUNT DISTINCT)
 * Endpoint: GET /api/donations/stats/distinct-donors-per-facility
 */
export const getDistinctDonorsPerFacility = async () => {
  const response = await fetch(`${API_BASE_URL}/donations/stats/distinct-donors-per-facility`);
  if (!response.ok) throw new Error('Failed to fetch distinct donors per facility');
  return await response.json();
};

/**
 * adnan - Get top donors having minimum total donated (GROUP BY + HAVING)
 * Endpoint: GET /api/donations/stats/top-donors-having
 */
export const getTopDonorsHaving = async () => {
  const response = await fetch(`${API_BASE_URL}/donations/stats/top-donors-having`);
  if (!response.ok) throw new Error('Failed to fetch top donors having');
  return await response.json();
};

/**
 * adnan - Get donations above average amount (scalar subquery)
 * Endpoint: GET /api/donations/stats/above-avg-subquery
 */
export const getDonationsAboveAverage = async () => {
  const response = await fetch(`${API_BASE_URL}/donations/stats/above-avg-subquery`);
  if (!response.ok) throw new Error('Failed to fetch donations above average');
  return await response.json();
};

/**
 * adnan - Get donors to food bank facilities (IN subquery)
 * Endpoint: GET /api/donations/stats/foodbank-donors-subquery
 */
export const getDonorsToFoodBankSubquery = async () => {
  const response = await fetch(`${API_BASE_URL}/donations/stats/foodbank-donors-subquery`);
  if (!response.ok) throw new Error('Failed to fetch food bank donors');
  return await response.json();
};

// ============================================================
// VOLUNTEER AGGREGATES (GROUP BY + HAVING)
// ============================================================

/**
 * adnan - Get volunteer count per facility (COUNT aggregate)
 * Endpoint: GET /api/volunteers/stats/volunteer-counts
 */
export const getFacilityVolunteerCounts = async () => {
  const response = await fetch(`${API_BASE_URL}/volunteers/stats/volunteer-counts`);
  if (!response.ok) throw new Error('Failed to fetch facility volunteer counts');
  return await response.json();
};

/**
 * adnan - Get facilities with minimum volunteers (GROUP BY + HAVING)
 * Endpoint: GET /api/volunteers/stats/facilities-min-volunteers-having
 */
export const getFacilitiesWithMinVolunteersHaving = async () => {
  const response = await fetch(`${API_BASE_URL}/volunteers/stats/facilities-min-volunteers-having`);
  if (!response.ok) throw new Error('Failed to fetch facilities with min volunteers');
  return await response.json();
};

/**
 * adnan - Get volunteer status stats having threshold (GROUP BY + HAVING)
 * Endpoint: GET /api/volunteers/stats/status-having
 */
export const getVolunteerStatusStatsHaving = async () => {
  const response = await fetch(`${API_BASE_URL}/volunteers/stats/status-having`);
  if (!response.ok) throw new Error('Failed to fetch volunteer status stats');
  return await response.json();
};

/**
 * adnan - Get volunteers who are also donors (IN + IN subquery)
 * Endpoint: GET /api/volunteers/stats/volunteer-donors-subquery
 */
export const getVolunteersWhoAreDonorsSubquery = async () => {
  const response = await fetch(`${API_BASE_URL}/volunteers/stats/volunteer-donors-subquery`);
  if (!response.ok) throw new Error('Failed to fetch volunteers who are donors');
  return await response.json();
};

/**
 * adnan - Get facilities with above average volunteers (scalar subquery)
 * Endpoint: GET /api/volunteers/stats/above-avg-volunteers-subquery
 */
export const getFacilitiesAboveAvgVolunteersSubquery = async () => {
  const response = await fetch(`${API_BASE_URL}/volunteers/stats/above-avg-volunteers-subquery`);
  if (!response.ok) throw new Error('Failed to fetch facilities above avg volunteers');
  return await response.json();
};

// ============================================================
// USER AGGREGATES (GROUP BY + HAVING)
// ============================================================

/**
 * adnan - Get active users with total activities (GROUP BY + HAVING)
 * Endpoint: GET /api/users/stats/active-having
 */
export const getActiveUsersHaving = async () => {
  const response = await fetch(`${API_BASE_URL}/users/stats/active-having`);
  if (!response.ok) throw new Error('Failed to fetch active users');
  return await response.json();
};

/**
 * adnan - Get users who never donated (NOT IN subquery)
 * Endpoint: GET /api/users/stats/never-donated-subquery
 */
export const getUsersNeverDonatedSubquery = async () => {
  const response = await fetch(`${API_BASE_URL}/users/stats/never-donated-subquery`);
  if (!response.ok) throw new Error('Failed to fetch users never donated');
  return await response.json();
};

/**
 * adnan - Get users with donations above average (scalar subquery)
 * Endpoint: GET /api/users/stats/above-avg-donation-subquery
 */
export const getUsersAboveAvgDonationSubquery = async () => {
  const response = await fetch(`${API_BASE_URL}/users/stats/above-avg-donation-subquery`);
  if (!response.ok) throw new Error('Failed to fetch users above avg donation');
  return await response.json();
};

// ============================================================
// FACILITY DASHBOARD (COMPLEX JOIN + AGGREGATES)
// ============================================================

/**
 * adnan - Get comprehensive facility dashboard (multi-table JOIN + aggregates)
 * Endpoint: GET /api/joins (from server.js - BONUS_facility_dashboard)
 */
export const getFacilityDashboard = async () => {
  const response = await fetch(`${API_BASE_URL}/joins`);
  if (!response.ok) throw new Error('Failed to fetch facility dashboard');
  const data = await response.json();
  return data.BONUS_facility_dashboard || [];
};