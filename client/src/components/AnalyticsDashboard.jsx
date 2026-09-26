import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getFacilityReviewCounts,
  getFacilityAverageRatings,
  getFacilitiesHavingMinReviews,
  getFacilityTypeStatsHaving,
  getFacilityTypeCapacityTotals,
  getFacilityTypeAverageCapacity,
  getFacilitiesCountPerCity,
  getFacilityTypeCapacityRange,
  getCitiesHavingManyFacilities,
  getFacilitiesAboveAvgCapacity,
  getFacilitiesWithDonationsSubquery,
  getFacilitiesWithFiveStarReviews,
  getFacilitiesWithoutEmergencyContactsSubquery,
  getFacilitiesAboveAvgAvailableSpaces,
  getFacilitiesAboveAvgServiceCountSubquery,
  getHighRatedFacilitiesHaving,
  getActiveReviewersHaving,
  getReviewsAboveAvgRating,
  getUnreviewedFacilitiesSubquery,
  getFacilityDonationTotals,
  getDonationStatsHaving,
  getTopDonorsByTotalDonated,
  getDistinctDonorsPerFacility,
  getTopDonorsHaving,
  getDonationsAboveAverage,
  getDonorsToFoodBankSubquery,
  getFacilityVolunteerCounts,
  getFacilitiesWithMinVolunteersHaving,
  getVolunteerStatusStatsHaving,
  getVolunteersWhoAreDonorsSubquery,
  getFacilitiesAboveAvgVolunteersSubquery,
  getActiveUsersHaving,
  getUsersNeverDonatedSubquery,
  getUsersAboveAvgDonationSubquery,
  getFacilityDashboard,
} from '../services/aggregateService';
import './AnalyticsDashboard.css';

/**
 * adnan - AnalyticsDashboard: Comprehensive analytics dashboard showcasing all aggregate functions
 * Displays GROUP BY, HAVING, and Subquery results in organized sections for operational insights
 * Follows existing project UI patterns (similar to FacilityList, UserList, etc.)
 */
const AnalyticsDashboard = () => {
  const [activeCategory, setActiveCategory] = useState('facility-aggregates');
  const [activeQuery, setActiveQuery] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = useMemo(() => [
    { key: 'facility-aggregates', label: 'Facility Aggregates', icon: '📊' },
    { key: 'facility-subqueries', label: 'Facility Subqueries', icon: '🔍' },
    { key: 'review-aggregates', label: 'Review Analytics', icon: '⭐' },
    { key: 'donation-aggregates', label: 'Donation Analytics', icon: '💰' },
    { key: 'volunteer-aggregates', label: 'Volunteer Analytics', icon: '🤝' },
    { key: 'user-aggregates', label: 'User Analytics', icon: '👥' },
    { key: 'dashboard', label: 'Facility Dashboard', icon: '📈' },
  ], []);

  const queriesByCategory = useMemo(() => ({
    'facility-aggregates': [
      { key: 'review-counts', label: 'Review Counts', fn: getFacilityReviewCounts, desc: 'COUNT: Reviews per facility', sqlType: 'COUNT + GROUP BY' },
      { key: 'avg-ratings', label: 'Avg Ratings', fn: getFacilityAverageRatings, desc: 'AVG: Average rating per facility', sqlType: 'AVG + GROUP BY' },
      { key: 'having-reviews', label: 'Min Reviews (HAVING)', fn: () => getFacilitiesHavingMinReviews(2), desc: 'GROUP BY + HAVING: Facilities with ≥2 reviews', sqlType: 'GROUP BY + HAVING' },
      { key: 'type-having', label: 'Type Stats (HAVING)', fn: () => getFacilityTypeStatsHaving(100), desc: 'GROUP BY + HAVING: Types with total capacity ≥100', sqlType: 'GROUP BY + HAVING' },
      { key: 'type-capacity-sum', label: 'Type Capacity Sum', fn: getFacilityTypeCapacityTotals, desc: 'SUM: Total capacity by facility type', sqlType: 'SUM + GROUP BY' },
      { key: 'type-capacity-avg', label: 'Type Capacity Avg', fn: getFacilityTypeAverageCapacity, desc: 'AVG: Average capacity by facility type', sqlType: 'AVG + GROUP BY' },
      { key: 'city-count', label: 'Facilities per City', fn: getFacilitiesCountPerCity, desc: 'COUNT: Facilities grouped by city', sqlType: 'COUNT + GROUP BY' },
      { key: 'type-capacity-range', label: 'Type Capacity Range', fn: getFacilityTypeCapacityRange, desc: 'MIN/MAX: Capacity range by type', sqlType: 'MIN/MAX + GROUP BY' },
      { key: 'cities-having', label: 'Cities (HAVING)', fn: () => getCitiesHavingManyFacilities(2), desc: 'GROUP BY + HAVING: Cities with ≥2 facilities', sqlType: 'GROUP BY + HAVING' },
    ],
    'facility-subqueries': [
      { key: 'above-avg-capacity', label: 'Above Avg Capacity', fn: getFacilitiesAboveAvgCapacity, desc: 'Subquery: Facilities > avg capacity', sqlType: 'Scalar Subquery' },
      { key: 'with-donations', label: 'Has Donations (IN)', fn: getFacilitiesWithDonationsSubquery, desc: 'IN Subquery: Facilities with donations', sqlType: 'IN Subquery' },
      { key: 'five-star', label: 'Has 5-Star (EXISTS)', fn: getFacilitiesWithFiveStarReviews, desc: 'EXISTS Subquery: Facilities with 5★ reviews', sqlType: 'EXISTS Subquery' },
      { key: 'no-emergency', label: 'No Emergency (NOT EXISTS)', fn: getFacilitiesWithoutEmergencyContactsSubquery, desc: 'NOT EXISTS: Facilities without contacts', sqlType: 'NOT EXISTS Subquery' },
      { key: 'above-avg-spaces', label: 'Above Avg Spaces', fn: getFacilitiesAboveAvgAvailableSpaces, desc: 'Subquery: Facilities > avg available spaces', sqlType: 'Scalar Subquery' },
      { key: 'above-avg-services', label: 'Above Avg Services', fn: getFacilitiesAboveAvgServiceCountSubquery, desc: 'Derived-table Subquery: Services > avg', sqlType: 'Derived Table Subquery' },
    ],
    'review-aggregates': [
      { key: 'high-rated-having', label: 'High-Rated (HAVING)', fn: getHighRatedFacilitiesHaving, desc: 'GROUP BY + HAVING: Facilities with ≥2 reviews & avg≥4', sqlType: 'GROUP BY + HAVING' },
      { key: 'active-reviewers', label: 'Active Reviewers', fn: getActiveReviewersHaving, desc: 'GROUP BY + HAVING: Users with many reviews', sqlType: 'GROUP BY + HAVING' },
      { key: 'above-avg-rating', label: 'Above Avg Rating', fn: getReviewsAboveAvgRating, desc: 'Subquery: Reviews > avg rating', sqlType: 'Scalar Subquery' },
      { key: 'unreviewed', label: 'Unreviewed Facilities', fn: getUnreviewedFacilitiesSubquery, desc: 'NOT IN Subquery: Never reviewed facilities', sqlType: 'NOT IN Subquery' },
    ],
    'donation-aggregates': [
      { key: 'donation-totals', label: 'Donation Totals', fn: getFacilityDonationTotals, desc: 'SUM: Total donations per facility', sqlType: 'SUM + GROUP BY' },
      { key: 'donation-stats-having', label: 'Stats (HAVING)', fn: getDonationStatsHaving, desc: 'GROUP BY + HAVING: Donation stats with filter', sqlType: 'GROUP BY + HAVING' },
      { key: 'top-donors-total', label: 'Top Donors (Total)', fn: getTopDonorsByTotalDonated, desc: 'SUM + ORDER BY: Top donors by amount', sqlType: 'SUM + ORDER BY' },
      { key: 'distinct-donors', label: 'Distinct Donors', fn: getDistinctDonorsPerFacility, desc: 'COUNT DISTINCT: Unique donors per facility', sqlType: 'COUNT DISTINCT + GROUP BY' },
      { key: 'top-donors-having', label: 'Top Donors (HAVING)', fn: getTopDonorsHaving, desc: 'GROUP BY + HAVING: Donors with ≥300 total', sqlType: 'GROUP BY + HAVING' },
      { key: 'above-avg-donations', label: 'Above Avg Donations', fn: getDonationsAboveAverage, desc: 'Subquery: Donations > avg amount', sqlType: 'Scalar Subquery' },
      { key: 'foodbank-donors', label: 'Food Bank Donors', fn: getDonorsToFoodBankSubquery, desc: 'IN Subquery: Donors to food banks', sqlType: 'IN Subquery' },
    ],
    'volunteer-aggregates': [
      { key: 'volunteer-counts', label: 'Volunteer Counts', fn: getFacilityVolunteerCounts, desc: 'COUNT: Volunteers per facility', sqlType: 'COUNT + GROUP BY' },
      { key: 'min-volunteers-having', label: 'Min Volunteers (HAVING)', fn: getFacilitiesWithMinVolunteersHaving, desc: 'GROUP BY + HAVING: Facilities with ≥N volunteers', sqlType: 'GROUP BY + HAVING' },
      { key: 'status-having', label: 'Status Stats (HAVING)', fn: getVolunteerStatusStatsHaving, desc: 'GROUP BY + HAVING: Volunteer status distribution', sqlType: 'GROUP BY + HAVING' },
      { key: 'volunteer-donors', label: 'Volunteer Donors', fn: getVolunteersWhoAreDonorsSubquery, desc: 'IN + IN Subquery: Users who volunteer AND donate', sqlType: 'IN + IN Subquery' },
      { key: 'above-avg-volunteers', label: 'Above Avg Volunteers', fn: getFacilitiesAboveAvgVolunteersSubquery, desc: 'Subquery: Facilities > avg volunteers', sqlType: 'Scalar Subquery' },
    ],
    'user-aggregates': [
      { key: 'active-users', label: 'Active Users (HAVING)', fn: getActiveUsersHaving, desc: 'GROUP BY + HAVING: Users with multi-table activity', sqlType: 'GROUP BY + HAVING' },
      { key: 'never-donated', label: 'Never Donated', fn: getUsersNeverDonatedSubquery, desc: 'NOT IN Subquery: Users with zero donations', sqlType: 'NOT IN Subquery' },
      { key: 'above-avg-donation', label: 'Above Avg Donation', fn: getUsersAboveAvgDonationSubquery, desc: 'Subquery: Users > avg total donated', sqlType: 'Scalar Subquery' },
    ],
    'dashboard': [
      { key: 'facility-dashboard', label: 'Full Dashboard', fn: getFacilityDashboard, desc: 'Multi-table JOIN + Aggregates: Complete facility overview', sqlType: 'JOIN + Aggregates' },
    ],
  }), []);

  const currentQueries = useMemo(() => queriesByCategory[activeCategory] || [], [activeCategory, queriesByCategory]);

  const fetchData = useCallback(async (queryKey) => {
    const query = currentQueries.find(q => q.key === queryKey);
    if (!query) return;

    setLoading(true);
    setError(null);
    setActiveQuery(queryKey);
    try {
      const result = await query.fn();
      setData({ key: queryKey, label: query.label, desc: query.desc, sqlType: query.sqlType, rows: result });
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [currentQueries]);

  useEffect(() => {
    if (currentQueries.length > 0) {
      fetchData(currentQueries[0].key);
    }
  }, [activeCategory, fetchData, currentQueries]);

  const formatValue = useCallback((value) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'number') {
      if (Number.isInteger(value)) return value.toLocaleString();
      return value.toFixed(2);
    }
    return String(value);
  }, []);

  const renderTable = useCallback(() => {
    if (!data) return null;
    if (!data.rows || data.rows.length === 0) {
      return <div className="analytics-empty">No data available</div>;
    }

    const columns = Object.keys(data.rows[0]);
    return (
      <div className="analytics-table-wrapper">
        <table className="analytics-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col}>{col.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col}>{formatValue(row[col])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="analytics-row-count">{data.rows.length} row(s) returned</p>
      </div>
    );
  }, [data, formatValue]);

  return (
    <div className="analytics-dashboard">
      <header className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <p className="analytics-subtitle">Aggregate Functions • GROUP BY • HAVING • Subqueries</p>
      </header>

      <nav className="analytics-category-nav" aria-label="Analytics categories">
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`analytics-category-btn ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </nav>

      <div className="analytics-content">
        <div className="analytics-queries" role="tablist">
          {currentQueries.map(query => (
            <button
              key={query.key}
              role="tab"
              aria-selected={activeQuery === query.key}
              className={`analytics-query-btn ${activeQuery === query.key ? 'active' : ''}`}
              onClick={() => fetchData(query.key)}
              title={query.desc}
            >
              <span className="query-label">{query.label}</span>
              <span className="query-sql-type">{query.sqlType}</span>
            </button>
          ))}
        </div>

        <div className="analytics-panel">
          <div className="analytics-panel-header">
            <h2>{data?.label || currentQueries.find(q => q.key === activeQuery)?.label || 'Select a query'}</h2>
            <p className="analytics-desc">{data?.desc || currentQueries.find(q => q.key === activeQuery)?.desc}</p>
            <span className="analytics-sql-badge">{data?.sqlType || ''}</span>
          </div>

          {loading && <div className="analytics-loading">Loading aggregate data...</div>}
          {error && <div className="analytics-error">Error: {error}</div>}
          {!loading && !error && renderTable()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;