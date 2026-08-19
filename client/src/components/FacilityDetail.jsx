import { useState, useEffect } from 'react';
import { getFacility } from '../services/facilityService';
import './FacilityDetail.css';

const FacilityDetail = ({ facilityId, onClose, _isLoading }) => {
  const [facility, setFacility] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!facilityId) return;

    const fetchFacility = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFacility(facilityId);
        setFacility(data);
      } catch (err) {
        setError(err.message || 'Failed to load facility details');
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, [facilityId]);

  if (!facilityId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
           <h2>Facility Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
           {loading && <div className="loading">Loading facility details...</div>}

          {error && <div className="error-message">{error}</div>}

          {facility && (
            <div className="facility-detail">
              <div className="detail-section">
                <h3>{facility.facility_name}</h3>
                <p className="detail-type">{facility.facility_type}</p>
              </div>

              <div className="detail-grid">
                <div className="detail-row">
                  <span className="detail-label">City:</span>
                  <span className="detail-value">{facility.city}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{facility.address}</span>
                </div>
                {facility.phone && (
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">
                      <a href={`tel:${facility.phone}`}>{facility.phone}</a>
                    </span>
                  </div>
                )}
                {facility.email && (
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      <a href={`mailto:${facility.email}`}>{facility.email}</a>
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Total Capacity:</span>
                  <span className="detail-value">{facility.capacity}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Available Spaces:</span>
                  <span className="detail-value">{facility.available_spaces}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Occupied:</span>
                  <span className="detail-value">{facility.capacity - facility.available_spaces}</span>
                </div>
              </div>

              {facility.description && (
                <div className="detail-description">
                  <h4>Description</h4>
                  <p>{facility.description}</p>
                </div>
              )}

              {(facility.latitude || facility.longitude) && (
                <div className="detail-location">
                  <h4>Location</h4>
                  <div className="detail-grid">
                    {facility.latitude && (
                      <div className="detail-row">
                        <span className="detail-label">Latitude:</span>
                        <span className="detail-value">{facility.latitude}</span>
                      </div>
                    )}
                    {facility.longitude && (
                      <div className="detail-row">
                        <span className="detail-label">Longitude:</span>
                        <span className="detail-value">{facility.longitude}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(facility.created_at || facility.updated_at) && (
                <div className="detail-meta">
                  {facility.created_at && (
                    <p className="meta-text">
                      Created: {new Date(facility.created_at).toLocaleString()}
                    </p>
                  )}
                  {facility.updated_at && (
                    <p className="meta-text">
                      Updated: {new Date(facility.updated_at).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetail;
