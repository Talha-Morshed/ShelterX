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
      <h2>Facilities</h2>
      <div className="facility-cards">
        {facilities.map((facility) => (
          <div key={facility.facility_id} className="facility-card">
            <div className="facility-header">
              <h3>{facility.facility_name}</h3>
              <span className="facility-type">{facility.facility_type}</span>
            </div>

            <div className="facility-info">
              <div className="info-row">
                <span className="label">City:</span>
                <span className="value">{facility.city}</span>
              </div>
              <div className="info-row">
                <span className="label">Address:</span>
                <span className="value">{facility.address}</span>
              </div>
              {facility.phone && (
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">{facility.phone}</span>
                </div>
              )}
              <div className="info-row">
                <span className="label">Capacity:</span>
                <span className="value">{facility.capacity}</span>
              </div>
              <div className="info-row">
                <span className="label">Available Spaces:</span>
                <span className="value">{facility.available_spaces}</span>
              </div>
              {facility.email && (
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{facility.email}</span>
                </div>
              )}
            </div>

            <div className="facility-actions">
              <button className="btn btn-info" onClick={() => onView(facility.facility_id)}>
                View
              </button>
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
