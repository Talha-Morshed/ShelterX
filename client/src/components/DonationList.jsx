import './DonationList.css';

const DonationList = ({ donations, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading donations...</div>;
  }

  if (!donations || donations.length === 0) {
    return <div className="no-data">No data found.</div>;
  }

  return (
    <div className="donation-list">
      <h2>Donations <span className="join-badge join-badge-full">FULL JOIN</span></h2>
      <p className="join-hint">Shows all facilities and all donations. Facilities with no donations show NULL donation fields.</p>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Facility ID</th>
              <th>Facility Name</th>
              <th>City</th>
              <th>Donation ID</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.donation_id ? `d-${d.donation_id}` : `f-${d.facility_id}-empty`} className={!d.donation_id ? 'row-highlight' : ''}>
                <td>{d.facility_id}</td>
                <td>{d.facility_name}</td>
                <td>{d.city}</td>
                <td>{d.donation_id || '—'}</td>
                <td>{d.amount || '—'}</td>
                <td>{d.donation_type || '—'}</td>
                <td>{d.notes || '—'}</td>
                <td className="actions-cell">
                  {d.donation_id ? (
                    <>
                      <button className="btn btn-edit" onClick={() => onEdit(d)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this donation?')) {
                            onDelete(d.donation_id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="null-value">No donation</span>
                  )}
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
