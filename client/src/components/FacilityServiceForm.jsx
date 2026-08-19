import { useState, useEffect } from 'react';
import './FacilityServiceForm.css';

const FacilityServiceForm = ({ onSubmit, initialData, isLoading, error }) => {
  const [formData, setFormData] = useState({
    facility_id: '',
    service_id: '',
    is_available: true,
    notes: '',
  });

  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        facility_id: initialData.facility_id || '',
        service_id: initialData.service_id || '',
        is_available: initialData.is_available !== undefined ? initialData.is_available : true,
        notes: initialData.notes || '',
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

    if (formData.service_id === '' || formData.service_id === null) {
      errors.push('Service ID is required');
    } else if (Number(formData.service_id) < 1) {
      errors.push('Service ID must be a positive number');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
      service_id: Number(formData.service_id),
    };

    onSubmit(submitData);
  };

  const handleReset = () => {
    setFormData({
      facility_id: '',
      service_id: '',
      is_available: true,
      notes: '',
    });
    setValidationErrors([]);
  };

  return (
    <form className="facility-service-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Update Facility Service' : 'Add Facility Service'}</h2>

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
        <label htmlFor="service_id">Service ID *</label>
        <input
          type="number"
          id="service_id"
          name="service_id"
          value={formData.service_id}
          onChange={handleChange}
          disabled={isLoading}
          min="1"
          placeholder="Enter service ID"
        />
      </div>

      <div className="form-group form-group-checkbox">
        <label htmlFor="is_available">
          <input
            type="checkbox"
            id="is_available"
            name="is_available"
            checked={formData.is_available}
            onChange={handleChange}
            disabled={isLoading}
          />
          Available
        </label>
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
          {isLoading ? 'Saving...' : initialData ? 'Update Facility Service' : 'Add Facility Service'}
        </button>
        <button type="button" disabled={isLoading} className="btn btn-secondary" onClick={handleReset}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default FacilityServiceForm;
