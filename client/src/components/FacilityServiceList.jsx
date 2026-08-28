import './FacilityServiceList.css';

const FacilityServiceList = ({ facilityServices, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading facility services...</div>;
  }

  if (!facilityServices || facilityServices.length === 0) {
    return <div className="no-data">No facility services found. Add one to get started!</div>;
  }

  return (
    <div className="facility-service-list">
      <h2>Facility Services</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Facility ID</th>
              <th>Service ID</th>
              <th>Available</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {facilityServices.map((fs) => (
              <tr key={fs.id}>
                <td>{fs.id}</td>
                <td>{fs.facility_id}</td>
                <td>{fs.service_id}</td>
                <td>{fs.is_available ? 'Yes' : 'No'}</td>
                <td>{fs.notes || '—'}</td>
                <td className="actions-cell">
                  <button className="btn btn-edit" onClick={() => onEdit(fs)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this facility service?')) {
                        onDelete(fs.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacilityServiceList;
