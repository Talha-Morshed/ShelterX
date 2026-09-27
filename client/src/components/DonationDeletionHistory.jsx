import './DonationDeletionHistory.css';

const formatDate = (value) => (value ? new Date(value).toLocaleString() : '\u2014');

const DonationDeletionHistory = ({ history, isLoading }) => {
  if (isLoading) {
    return <div className="donation-history-state" role="status">Loading deleted donations...</div>;
  }

  return (
    <section className="donation-deletion-history" aria-labelledby="donation-history-heading">
      <div className="donation-history-heading">
        <div>
          <p className="donation-history-eyebrow">Donation records</p>
          <h2 id="donation-history-heading">Deleted Donations</h2>
        </div>
        <span className="donation-history-count">{history.length} records</span>
      </div>

      {history.length === 0 ? (
        <div className="donation-history-state">No deleted donations have been recorded.</div>
      ) : (
        <div className="donation-history-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Donation ID</th>
                <th>Facility</th>
                <th>Donor</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Created</th>
                <th>Deleted</th>
              </tr>
            </thead>
            <tbody>
              {history.map((donation) => (
                <tr key={donation.history_id}>
                  <td>{donation.donation_id}</td>
                  <td>{donation.facility_name || `Facility #${donation.facility_id}`}</td>
                  <td>{donation.donor_name || `User #${donation.user_id}`}</td>
                  <td>${Number(donation.amount).toFixed(2)}</td>
                  <td>{donation.donation_type}</td>
                  <td>{formatDate(donation.donation_created_at)}</td>
                  <td>{formatDate(donation.deleted_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default DonationDeletionHistory;
