import './JoinTable.css';

const FacilityReviewsTab = ({ data, isLoading }) => {
  if (isLoading) return <div className="loading">Loading...</div>;
  if (!data || data.length === 0) return <div className="no-data">No data found.</div>;

  return (
    <div className="join-table">
      <h2>LEFT JOIN: Facilities with Review Stats</h2>
      <p className="join-info">All facilities shown, even those with 0 reviews (NULL values).</p>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Facility Name</th>
              <th>Type</th>
              <th>City</th>
              <th>Total Reviews</th>
              <th>Avg Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.facility_id} className={row.total_reviews === 0 ? 'row-highlight' : ''}>
                <td>{row.facility_id}</td>
                <td>{row.facility_name}</td>
                <td>{row.facility_type}</td>
                <td>{row.city}</td>
                <td>{row.total_reviews}</td>
                <td>{row.avg_rating || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacilityReviewsTab;
