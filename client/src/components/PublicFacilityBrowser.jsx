import { useEffect, useState } from 'react';
import { getFacilities } from '../services/facilityService';
import './PublicFacilityBrowser.css';

const formatFacilityType = (type) => (type || 'Support facility').replaceAll('_', ' ');

const PublicFacilityBrowser = ({ onHome, onAdmin }) => {
  const [facilities, setFacilities] = useState([]);
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
            {isLoading ? 'Loading locations...' : `${facilities.length} locations listed`}
          </span>
        </div>

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

        {!isLoading && !error && facilities.length > 0 && (
          <div className="public-facility-grid">
            {facilities.map((facility) => (
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
