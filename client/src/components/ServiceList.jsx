import './ServiceList.css';

const ServiceList = ({ services, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading services...</div>;
  }

  if (!services || services.length === 0) {
    return <div className="no-data">No services found. Add one to get started!</div>;
  }

  return (
    <div className="service-list">
      <h2>Services</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.service_id}>
                <td>{service.service_id}</td>
                <td>{service.service_name}</td>
                <td>{service.service_description || '—'}</td>
                <td>{service.category || '—'}</td>
                <td className="actions-cell">
                  <button className="btn btn-edit" onClick={() => onEdit(service)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${service.service_name}"?`)) {
                        onDelete(service.service_id);
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

export default ServiceList;
