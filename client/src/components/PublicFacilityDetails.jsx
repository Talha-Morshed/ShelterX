import { useEffect, useState } from 'react';
import { getFacilityById } from '../services/facilityService';
import { getFacilityServicesByFacility } from '../services/facilityServiceService';
import './PublicFacilityDetails.css';

const formatFacilityType = (type) => (type || 'Support facility').replaceAll('_', ' ');
const formatValue = (value) => value || 'Not provided';

const PublicFacilityDetails = ({ facilityId, onBack, onHome, onAdmin }) => {
  const [facility, setFacility] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servicesError, setServicesError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDetails = async () => {
      try {
        const facilityData = await getFacilityById(facilityId);
        if (!isMounted) return;

        if (!facilityData) {
          setIsLoading(false);
          return;
        }

        setFacility(facilityData);
        setIsLoading(false);

        try {
          const serviceData = await getFacilityServicesByFacility(facilityId);
          if (isMounted) {
            setServices(serviceData || []);
          }
        } catch (serviceError) {
          if (isMounted) {
            setServicesError(true);
          }
          console.error(serviceError);
        }
      } catch (loadError) {
        if (isMounted) {
          setError('We could not load this facility right now. Please try again later.');
          setIsLoading(false);
        }
        console.error(loadError);
      }
    };

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [facilityId]);

  const renderStatus = (isActive) => (
    <span className={`details-status ${isActive ? 'details-status-active' : 'details-status-inactive'}`}>
      {isActive ? 'Active' : 'Currently inactive'}
    </span>
  );

  return (
    <div className="public-shell public-details-page">
      <header className="public-header public-browser-header">
        <button type="button" className="public-brand" onClick={onHome}>
          <span className="public-brand-mark">S</span>
          <span>ShelterX</span>
        </button>
        <nav className="public-nav" aria-label="Public navigation">
          <button type="button" className="public-nav-link" onClick={onHome}>Home</button>
          <button type="button" className="public-nav-link public-admin-link" onClick={onAdmin}>Admin Dashboard</button>
        </nav>
      </header>

      <main className="public-details-main">
        <button type="button" className="details-back-link" onClick={onBack}>
          &lt;- Back to Find Help
        </button>

        {isLoading && (
          <div className="public-state public-loading-state" role="status">
            <span className="public-loader" aria-hidden="true" />
            <p>Loading facility details...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="public-state public-error-state" role="alert">
            <h1>Facility details are unavailable</h1>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && !facility && (
          <div className="public-state public-empty-state">
            <h1>Facility not found.</h1>
            <p>The support location you requested could not be found.</p>
          </div>
        )}

        {!isLoading && !error && facility && (
          <article className="details-card">
            <div className="details-hero">
              <div>
                <p className="public-eyebrow">Facility information</p>
                <h1>{facility.facility_name}</h1>
                <p className="details-type">{formatFacilityType(facility.facility_type)}</p>
              </div>
              {renderStatus(Boolean(Number(facility.is_active)))}
            </div>

            <div className="details-content">
              <section className="details-availability" aria-labelledby="availability-heading">
                <div>
                  <p className="public-eyebrow">Capacity</p>
                  <h2 id="availability-heading">{facility.available_spaces ?? 0} / {facility.capacity ?? 0} spaces available</h2>
                </div>
                <div className="details-capacity-track" aria-hidden="true">
                  <span style={{ width: `${facility.capacity > 0 ? Math.min(100, (facility.available_spaces / facility.capacity) * 100) : 0}%` }} />
                </div>
                <div className="details-capacity-numbers">
                  <span>Available spaces <strong>{facility.available_spaces ?? 0}</strong></span>
                  <span>Total capacity <strong>{facility.capacity ?? 0}</strong></span>
                </div>
              </section>

              <div className="details-columns">
                <section className="details-section" aria-labelledby="location-heading">
                  <p className="public-eyebrow">Location and contact</p>
                  <h2 id="location-heading">Reach this facility</h2>
                  <dl className="details-list">
                    <div>
                      <dt>Address</dt>
                      <dd>{formatValue(facility.address)}</dd>
                    </div>
                    <div>
                      <dt>City</dt>
                      <dd>{formatValue(facility.city)}</dd>
                    </div>
                    <div>
                      <dt>State</dt>
                      <dd>{formatValue(facility.state)}</dd>
                    </div>
                    <div>
                      <dt>ZIP Code</dt>
                      <dd>{formatValue(facility.zip_code)}</dd>
                    </div>
                    <div>
                      <dt>Phone</dt>
                      <dd>{facility.phone ? <a href={`tel:${facility.phone}`}>{facility.phone}</a> : 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{facility.email ? <a href={`mailto:${facility.email}`}>{facility.email}</a> : 'Not provided'}</dd>
                    </div>
                  </dl>
                </section>

                <section className="details-section" aria-labelledby="description-heading">
                  <p className="public-eyebrow">About this location</p>
                  <h2 id="description-heading">What to expect</h2>
                  <p className="details-description">{formatValue(facility.description)}</p>
                </section>
              </div>

              <section className="details-services" aria-labelledby="services-heading">
                <div>
                  <p className="public-eyebrow">Support offered</p>
                  <h2 id="services-heading">Services available</h2>
                </div>
                {servicesError && <p className="details-services-note">Services are temporarily unavailable.</p>}
                {!servicesError && services.length === 0 && <p className="details-services-note">No services are currently listed for this facility.</p>}
                {!servicesError && services.length > 0 && (
                  <ul className="details-service-list">
                    {services.map((service) => (
                      <li key={service.id}>
                        <span aria-hidden="true">+</span>
                        {service.service_name}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default PublicFacilityDetails;
