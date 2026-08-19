import { useState, useEffect } from 'react';
import './VolunteerForm.css';

const VolunteerForm = ({ onSubmit, initialData, isLoading, error }) => {
  const [formData, setFormData] = useState({
    facility_id: '',
    user_id: '',
    role: '',
    availability: '',
    status: '',
  });

  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        facility_id: initialData.facility_id || '',
        user_id: initialData.user_id || '',
        role: initialData.role || '',
        availability: initialData.availability || '',
        status: initialData.status || '',
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

    if (formData.status && !['pending', 'approved', 'rejected'].includes(formData.status)) {
      errors.push('Invalid status');
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
    };

    onSubmit(submitData);
  };

  const handleReset = () => {
    setFormData({
      facility_id: '',
      user_id: '',
      role: '',
      availability: '',
      status: '',
    });
    setValidationErrors([]);
  };

  return (
    <form className="volunteer-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Update Volunteer' : 'Add Volunteer'}</h2>

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
        <label htmlFor="role">Role</label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter volunteer role"
        />
      </div>

      <div className="form-group">
        <label htmlFor="availability">Availability</label>
        <input
          type="text"
          id="availability"
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="e.g. Weekends, Mon-Fri 9am-5pm"
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">Select a status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? 'Saving...' : initialData ? 'Update Volunteer' : 'Add Volunteer'}
        </button>
        <button type="button" disabled={isLoading} className="btn btn-secondary" onClick={handleReset}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default VolunteerForm;
