import './JoinTable.css';

const FacilityDonationsTab = ({ data, isLoading }) => {
  if (isLoading) return <div className="loading">Loading...</div>;
  if (!data || data.length === 0) return <div className="no-data">No data found.</div>;

  return (
    <div className="join-table">
      <h2>FULL JOIN: Facilities and Donations</h2>
      <p className="join-info">All facilities AND all donations shown. NULL donation fields = facility has no donations.</p>
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
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className={!row.donation_id ? 'row-highlight' : ''}>
                <td>{row.facility_id}</td>
                <td>{row.facility_name}</td>
                <td>{row.city}</td>
                <td>{row.donation_id || '—'}</td>
                <td>{row.amount || '—'}</td>
                <td>{row.donation_type || '—'}</td>
                <td>{row.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacilityDonationsTab;
