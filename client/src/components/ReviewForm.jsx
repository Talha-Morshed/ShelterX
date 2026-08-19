import { useState, useEffect } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ onSubmit, initialData, isLoading, error }) => {
  const [formData, setFormData] = useState({
    facility_id: '',
    user_id: '',
    rating: '',
    comment: '',
  });

  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        facility_id: initialData.facility_id || '',
        user_id: initialData.user_id || '',
        rating: initialData.rating || '',
        comment: initialData.comment || '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const errors = [];

    if (formData.facility_id === '' || formData.facility_id === null) {
      errors.push('Facility ID is required');
    } else if (Number(formData.facility_id) < 1) {
      errors.push('Facility ID must be a positive number');
    }

    if (formData.user_id === '' || formData.user_id === null) {
      errors.push('User ID is required');
    } else if (Number(formData.user_id) < 1) {
      errors.push('User ID must be a positive number');
    }

    if (!formData.rating) {
      errors.push('Rating is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      facility_id: Number(formData.facility_id),
      user_id: Number(formData.user_id),
      rating: Number(formData.rating),
    };

    onSubmit(submitData);
  };

  const handleReset = () => {
    setFormData({
      facility_id: '',
      user_id: '',
      rating: '',
      comment: '',
    });
    setValidationErrors([]);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Update Review' : 'Add Review'}</h2>

      {error && <div className="error-message">{error}</div>}

      {validationErrors.length > 0 && (
        <div className="validation-errors">
          <ul>
            {validationErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="facility_id">Facility ID *</label>
        <input
          type="number"
          id="facility_id"
          name="facility_id"
          value={formData.facility_id}
          onChange={handleChange}
          disabled={isLoading}
          min="1"
          placeholder="Enter facility ID"
        />
      </div>

      <div className="form-group">
        <label htmlFor="user_id">User ID *</label>
        <input
          type="number"
          id="user_id"
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          disabled={isLoading}
          min="1"
          placeholder="Enter user ID"
        />
      </div>

      <div className="form-group">
        <label htmlFor="rating">Rating *</label>
        <select
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">Select a rating</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Fair</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Very Good</option>
          <option value="5">5 - Excellent</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="comment">Comment</label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter your comment"
          rows="4"
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? 'Saving...' : initialData ? 'Update Review' : 'Add Review'}
        </button>
        <button type="button" disabled={isLoading} className="btn btn-secondary" onClick={handleReset}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
