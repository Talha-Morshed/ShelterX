import { useEffect, useState } from 'react';
import { getFacilities } from '../services/facilityService';
import './PublicFacilityBrowser.css';

const formatFacilityType = (type) => (type || 'Support facility').replaceAll('_', ' ');
const facilityTypes = [
  { value: '', label: 'All facility types' },
  { value: 'shelter', label: 'Shelter' },
  { value: 'food_bank', label: 'Food Bank' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'community_center', label: 'Community Center' },
  { value: 'housing', label: 'Housing' },
  { value: 'other', label: 'Other' },
];

const PublicFacilityBrowser = ({ onHome, onAdmin }) => {
  const [facilities, setFacilities] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [facilityType, setFacilityType] = useState('');
  const [city, setCity] = useState('');
  const [availability, setAvailability] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadFacilities = async () => {
      try {
        const data = await getFacilities();
        if (isMounted) {
          setFacilities(data || []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError('We could not load support locations right now. Please try again later.');
        }
        console.error(loadError);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFacilities();

    return () => {
      isMounted = false;
    };
  }, []);

  const cities = [...new Set(facilities.map((facility) => facility.city).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const normalizedSearch = searchText.trim().toLowerCase();
  const filteredFacilities = facilities.filter((facility) => {
    const searchableText = [facility.facility_name, facility.city, facility.address, facility.facility_type]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
    const matchesType = !facilityType || facility.facility_type === facilityType;
    const matchesCity = !city || facility.city === city;
    const hasAvailability = Number(facility.available_spaces) > 0;
    const matchesAvailability = !availability
      || (availability === 'available' && hasAvailability)
      || (availability === 'full' && !hasAvailability);
    const isActive = Boolean(Number(facility.is_active));
    const matchesStatus = !status
      || (status === 'active' && isActive)
      || (status === 'inactive' && !isActive);

    return matchesSearch && matchesType && matchesCity && matchesAvailability && matchesStatus;
  });

  const clearFilters = () => {
    setSearchText('');
    setFacilityType('');
    setCity('');
    setAvailability('');
    setStatus('');
  };

  return (
    <div className="public-shell public-browser">
      <header className="public-header public-browser-header">
        <button type="button" className="public-brand" onClick={onHome}>
          <span className="public-brand-mark">S</span>
          <span>ShelterX</span>
        </button>
        <nav className="public-nav" aria-label="Public navigation">
          <button type="button" className="public-nav-link" onClick={onHome}>
            Home
          </button>
          <button type="button" className="public-nav-link public-admin-link" onClick={onAdmin}>
            Admin Dashboard
          </button>
        </nav>
      </header>

      <main className="public-browser-main">
        <div className="public-browser-heading">
          <div>
            <p className="public-eyebrow">Browse support locations</p>
            <h1>Find help near you.</h1>
            <p>Explore shelters and community facilities with space and support available.</p>
          </div>
          <span className="public-result-note">
            {isLoading ? 'Loading locations...' : `${filteredFacilities.length} ${filteredFacilities.length === 1 ? 'facility' : 'facilities'} found`}
          </span>
        </div>

        {!isLoading && !error && facilities.length > 0 && (
          <section className="public-filters" aria-label="Facility search and filters">
            <label className="public-search-field">
              <span>Search facilities</span>
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search for a facility, city, or address..."
              />
            </label>
            <div className="public-filter-grid">
              <label>
                <span>Facility type</span>
                <select value={facilityType} onChange={(event) => setFacilityType(event.target.value)}>
                  {facilityTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </label>
              <label>
                <span>City</span>
                <select value={city} onChange={(event) => setCity(event.target.value)}>
                  <option value="">All cities</option>
                  {cities.map((cityName) => <option key={cityName} value={cityName}>{cityName}</option>)}
                </select>
              </label>
              <label>
                <span>Availability</span>
                <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
                  <option value="">All availability</option>
                  <option value="available">Available only</option>
                  <option value="full">Full only</option>
                </select>
              </label>
              <label>
                <span>Status</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="">All statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>
            <button type="button" className="public-clear-button" onClick={clearFilters}>
              Clear Filters
            </button>
          </section>
        )}

        {isLoading && (
          <div className="public-state public-loading-state" role="status">
            <span className="public-loader" aria-hidden="true" />
            <p>Loading support locations...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="public-state public-error-state" role="alert">
            <h2>Support locations are unavailable</h2>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && facilities.length === 0 && (
          <div className="public-state public-empty-state">
            <h2>No facilities are currently available.</h2>
            <p>Please check back soon for updated support locations.</p>
          </div>
        )}

        {!isLoading && !error && facilities.length > 0 && filteredFacilities.length === 0 && (
          <div className="public-state public-empty-state">
            <h2>No facilities found.</h2>
            <p>Try changing your search or filters.</p>
          </div>
        )}

        {!isLoading && !error && filteredFacilities.length > 0 && (
          <div className="public-facility-grid">
            {filteredFacilities.map((facility) => (
              <article className={`public-facility-card ${facility.is_active ? '' : 'public-facility-inactive'}`} key={facility.facility_id}>
                <div className="public-facility-card-topline">
                  <span className="public-facility-type">{formatFacilityType(facility.facility_type)}</span>
                  <span className={`public-status ${facility.is_active ? 'public-status-active' : 'public-status-inactive'}`}>
                    {facility.is_active ? 'Active' : 'Currently inactive'}
                  </span>
                </div>
                <h2>{facility.facility_name}</h2>
                <p className="public-facility-location">
                  {facility.city || 'Location not listed'}
                  {facility.state ? `, ${facility.state}` : ''}
                </p>
                <div className="public-capacity">
                  <div>
                    <span>Available</span>
                    <strong>{facility.available_spaces ?? 0} / {facility.capacity ?? 0} spaces</strong>
                  </div>
                  <div className="public-capacity-track" aria-hidden="true">
                    <span
                      style={{
                        width: `${facility.capacity > 0 ? Math.min(100, (facility.available_spaces / facility.capacity) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="public-facility-details">
                  {facility.address && <p><span>Address</span>{facility.address}</p>}
                  {facility.phone && <p><span>Phone</span>{facility.phone}</p>}
                </div>
                <button type="button" className="public-details-button" disabled title="Facility details will be available in a later update">
                  View Details
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PublicFacilityBrowser;
