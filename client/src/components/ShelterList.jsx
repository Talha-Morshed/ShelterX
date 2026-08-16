import './ShelterList.css';

const ShelterList = ({ shelters, onEdit, onDelete, onView, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading shelters...</div>;
  }

  if (!shelters || shelters.length === 0) {
    return <div className="no-shelters">No shelters found. Add one to get started!</div>;
  }

  return (
    <div className="shelter-list">
      <h2>Shelters</h2>
      <div className="shelter-cards">
        {shelters.map((shelter) => (
          <div key={shelter.shelter_id} className="shelter-card">
            <div className="shelter-header">
              <h3>{shelter.shelter_name}</h3>
              <span className="shelter-type">{shelter.shelter_type}</span>
            </div>

            <div className="shelter-info">
              <div className="info-row">
                <span className="label">City:</span>
                <span className="value">{shelter.city}</span>
              </div>
              <div className="info-row">
                <span className="label">Address:</span>
                <span className="value">{shelter.address}</span>
              </div>
              {shelter.phone && (
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">{shelter.phone}</span>
                </div>
              )}
              <div className="info-row">
                <span className="label">Capacity:</span>
                <span className="value">{shelter.capacity}</span>
              </div>
              <div className="info-row">
                <span className="label">Available Spaces:</span>
                <span className="value">{shelter.available_spaces}</span>
              </div>
              {shelter.email && (
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{shelter.email}</span>
                </div>
              )}
            </div>

            <div className="shelter-actions">
              <button className="btn btn-info" onClick={() => onView(shelter.shelter_id)}>
                View
              </button>
              <button className="btn btn-warning" onClick={() => onEdit(shelter)}>
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${shelter.shelter_name}"?`)) {
                    onDelete(shelter.shelter_id);
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

export default ShelterList;
