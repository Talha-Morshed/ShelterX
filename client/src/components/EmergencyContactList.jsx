import './EmergencyContactList.css';

const EmergencyContactList = ({ emergencyContacts, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading emergency contacts...</div>;
  }

  if (!emergencyContacts || emergencyContacts.length === 0) {
    return <div className="no-data">No emergency contacts found. Add one to get started!</div>;
  }

  return (
    <div className="emergency-contact-list">
      <h2>Emergency Contacts</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Facility</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Primary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emergencyContacts.map((contact) => (
              <tr key={contact.contact_id}>
                <td>{contact.contact_id}</td>
                <td>{contact.facility_name || contact.facility_id}</td>
                <td>{contact.contact_name}</td>
                <td>{contact.contact_phone || '—'}</td>
                <td>{contact.contact_role || '—'}</td>
                <td>{contact.is_primary ? 'Yes' : 'No'}</td>
                <td className="actions-cell">
                  <button className="btn btn-edit" onClick={() => onEdit(contact)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${contact.contact_name}"?`)) {
                        onDelete(contact.contact_id);
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

export default EmergencyContactList;
