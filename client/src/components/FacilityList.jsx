import './FacilityList.css';

const FacilityList = ({ facilities, onEdit, onDelete, onView, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading facilities...</div>;
  }

  if (!facilities || facilities.length === 0) {
    return <div className="no-facilities">No facilities found. Add one to get started!</div>;
  }

  return (
    <div className="facility-list">
      <h2>Facilities <span className="join-badge">LEFT JOIN</span></h2>
      <p className="join-hint">Shows all facilities with review stats. Facilities with 0 reviews still appear.</p>
      <div className="facility-cards">
        {facilities.map((facility) => (
          <div key={facility.facility_id} className={`facility-card ${facility.total_reviews === 0 ? 'card-highlight' : ''}`}>
            <div className="facility-header">
              <h3>{facility.facility_name}</h3>
              <span className="facility-id">#{facility.facility_id}</span>
              <span className="facility-type">{facility.facility_type}</span>
            </div>

            <div className="facility-info">
              <div className="info-row">
                <span className="label">City:</span>
                <span className="value">{facility.city}</span>
              </div>
              {facility.address && (
                <div className="info-row">
                  <span className="label">Address:</span>
                  <span className="value">{facility.address}</span>
                </div>
              )}
              {facility.phone && (
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">{facility.phone}</span>
                </div>
              )}
              {facility.capacity !== undefined && (
                <div className="info-row">
                  <span className="label">Capacity:</span>
                  <span className="value">{facility.capacity}</span>
                </div>
              )}
              {facility.available_spaces !== undefined && (
                <div className="info-row">
                  <span className="label">Available Spaces:</span>
                  <span className="value">{facility.available_spaces}</span>
                </div>
              )}
              {facility.total_reviews !== undefined && (
                <div className="info-row">
                  <span className="label">Reviews:</span>
                  <span className="value">{facility.total_reviews}</span>
                </div>
              )}
              {facility.avg_rating !== undefined && facility.avg_rating !== null && (
                <div className="info-row">
                  <span className="label">Avg Rating:</span>
                  <span className="value">{facility.avg_rating} / 5</span>
                </div>
              )}
              {facility.total_reviews === 0 && facility.avg_rating === null && (
                <div className="info-row">
                  <span className="label">Note:</span>
                  <span className="value null-value">No reviews yet (NULL from LEFT JOIN)</span>
                </div>
              )}
            </div>

            <div className="facility-actions">
              <button className="btn btn-warning" onClick={() => onEdit(facility)}>
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${facility.facility_name}"?`)) {
                    onDelete(facility.facility_id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilityList;
