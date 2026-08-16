import { useState, useEffect } from 'react';
import { getShelter } from '../services/shelterService';
import './ShelterDetail.css';

const ShelterDetail = ({ shelterId, onClose, _isLoading }) => {
  const [shelter, setShelter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shelterId) return;

    const fetchShelter = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getShelter(shelterId);
        setShelter(data);
      } catch (err) {
        setError(err.message || 'Failed to load facility details');
      } finally {
        setLoading(false);
      }
    };

    fetchShelter();
  }, [shelterId]);

  if (!shelterId) return null;

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

          {shelter && (
            <div className="shelter-detail">
              <div className="detail-section">
                <h3>{shelter.shelter_name}</h3>
                <p className="detail-type">{shelter.shelter_type}</p>
              </div>

              <div className="detail-grid">
                <div className="detail-row">
                  <span className="detail-label">City:</span>
                  <span className="detail-value">{shelter.city}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{shelter.address}</span>
                </div>
                {shelter.phone && (
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">
                      <a href={`tel:${shelter.phone}`}>{shelter.phone}</a>
                    </span>
                  </div>
                )}
                {shelter.email && (
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      <a href={`mailto:${shelter.email}`}>{shelter.email}</a>
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Total Capacity:</span>
                  <span className="detail-value">{shelter.capacity}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Available Spaces:</span>
                  <span className="detail-value">{shelter.available_spaces}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Occupied:</span>
                  <span className="detail-value">{shelter.capacity - shelter.available_spaces}</span>
                </div>
              </div>

              {shelter.description && (
                <div className="detail-description">
                  <h4>Description</h4>
                  <p>{shelter.description}</p>
                </div>
              )}

              {(shelter.latitude || shelter.longitude) && (
                <div className="detail-location">
                  <h4>Location</h4>
                  <div className="detail-grid">
                    {shelter.latitude && (
                      <div className="detail-row">
                        <span className="detail-label">Latitude:</span>
                        <span className="detail-value">{shelter.latitude}</span>
                      </div>
                    )}
                    {shelter.longitude && (
                      <div className="detail-row">
                        <span className="detail-label">Longitude:</span>
                        <span className="detail-value">{shelter.longitude}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(shelter.created_at || shelter.updated_at) && (
                <div className="detail-meta">
                  {shelter.created_at && (
                    <p className="meta-text">
                      Created: {new Date(shelter.created_at).toLocaleString()}
                    </p>
                  )}
                  {shelter.updated_at && (
                    <p className="meta-text">
                      Updated: {new Date(shelter.updated_at).toLocaleString()}
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

export default ShelterDetail;
