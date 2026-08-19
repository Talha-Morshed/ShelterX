import './VolunteerList.css';

const VolunteerList = ({ volunteers, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading volunteers...</div>;
  }

  if (!volunteers || volunteers.length === 0) {
    return <div className="no-data">No volunteers found. Add one to get started!</div>;
  }

  return (
    <div className="volunteer-list">
      <h2>Volunteers</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Facility ID</th>
              <th>User ID</th>
              <th>Role</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((volunteer) => (
              <tr key={volunteer.volunteer_id}>
                <td>{volunteer.volunteer_id}</td>
                <td>{volunteer.facility_id}</td>
                <td>{volunteer.user_id}</td>
                <td>{volunteer.role || '—'}</td>
                <td>{volunteer.availability || '—'}</td>
                <td>{volunteer.status || '—'}</td>
                <td className="actions-cell">
                  <button className="btn btn-edit" onClick={() => onEdit(volunteer)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this volunteer?')) {
                        onDelete(volunteer.volunteer_id);
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

export default VolunteerList;
