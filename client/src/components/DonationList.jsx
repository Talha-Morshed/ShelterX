import './DonationList.css';

const DonationList = ({ donations, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading donations...</div>;
  }

  if (!donations || donations.length === 0) {
    return <div className="no-data">No donations found. Add one to get started!</div>;
  }

  return (
    <div className="donation-list">
      <h2>Donations</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Facility ID</th>
              <th>User ID</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.donation_id}>
                <td>{donation.donation_id}</td>
                <td>{donation.facility_id}</td>
                <td>{donation.user_id}</td>
                <td>{donation.amount}</td>
                <td>{donation.type || '—'}</td>
                <td>{donation.notes || '—'}</td>
                <td className="actions-cell">
                  <button className="btn btn-edit" onClick={() => onEdit(donation)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this donation?')) {
                        onDelete(donation.donation_id);
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

export default DonationList;
