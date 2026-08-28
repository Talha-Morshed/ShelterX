import { useState, useEffect } from 'react';
import './DonationForm.css';

const DonationForm = ({ onSubmit, initialData, isLoading, error }) => {
  const [formData, setFormData] = useState({
    facility_id: '',
    user_id: '',
    amount: '',
    donation_type: '',
    notes: '',
  });

  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        facility_id: initialData.facility_id ?? '',
        user_id: initialData.user_id ?? '',
        amount: initialData.amount ?? '',
        donation_type: initialData.donation_type ?? '',
        notes: initialData.notes ?? '',
      });
    } else {
      setFormData({ facility_id: '', user_id: '', amount: '', donation_type: '', notes: '' });
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

    if (formData.amount === '' || formData.amount === null) {
      errors.push('Amount is required');
    } else if (Number(formData.amount) < 0) {
      errors.push('Amount cannot be negative');
    }

    if (formData.donation_type && !['money', 'food', 'clothing', 'supplies', 'other'].includes(formData.donation_type)) {
      errors.push('Invalid donation type');
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
      amount: Number(formData.amount),
    };

    onSubmit(submitData);
  };

  const handleReset = () => {
    setFormData({
      facility_id: '',
      user_id: '',
      amount: '',
      donation_type: '',
      notes: '',
    });
    setValidationErrors([]);
  };

  return (
    <form className="donation-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Update Donation' : 'Add Donation'}</h2>

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
        <label htmlFor="amount">Amount *</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          disabled={isLoading}
          min="0"
          step="0.01"
          placeholder="Enter donation amount"
        />
      </div>

      <div className="form-group">
        <label htmlFor="donation_type">Donation Type</label>
        <select
          id="donation_type"
          name="donation_type"
          value={formData.donation_type}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">Select a type</option>
          <option value="money">Money</option>
          <option value="food">Food</option>
          <option value="clothing">Clothing</option>
          <option value="supplies">Supplies</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter notes"
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? 'Saving...' : initialData ? 'Update Donation' : 'Add Donation'}
        </button>
        <button type="button" disabled={isLoading} className="btn btn-secondary" onClick={handleReset}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default DonationForm;
