import './JoinTable.css';

const UserReviewsTab = ({ data, isLoading }) => {
  if (isLoading) return <div className="loading">Loading...</div>;
  if (!data || data.length === 0) return <div className="no-data">No data found.</div>;

  return (
    <div className="join-table">
      <h2>RIGHT JOIN: Users with Reviews</h2>
      <p className="join-info">All users shown, even those who never wrote a review (NULL review fields).</p>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Review ID</th>
              <th>Rating</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className={!row.review_id ? 'row-highlight' : ''}>
                <td>{row.user_id}</td>
                <td>{row.full_name}</td>
                <td>{row.email}</td>
                <td>{row.review_id || '—'}</td>
                <td>{row.rating || '—'}</td>
                <td>{row.comment || 'No review yet'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserReviewsTab;
