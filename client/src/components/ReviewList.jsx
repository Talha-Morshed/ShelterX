import './ReviewList.css';

const ReviewList = ({ reviews, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading reviews...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div className="no-data">No reviews found. Add one to get started!</div>;
  }

  return (
    <div className="review-list">
      <h2>Reviews</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Facility ID</th>
              <th>User ID</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.review_id}>
                <td>{review.review_id}</td>
                <td>{review.facility_id}</td>
                <td>{review.user_id}</td>
                <td>{review.rating}</td>
                <td>{review.comment || '—'}</td>
                <td className="actions-cell">
                  <button className="btn btn-edit" onClick={() => onEdit(review)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this review?')) {
                        onDelete(review.review_id);
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

export default ReviewList;
