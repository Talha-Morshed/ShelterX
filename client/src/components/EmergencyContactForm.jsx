import { useState, useEffect } from 'react';
import './EmergencyContactForm.css';

const EmergencyContactForm = ({ onSubmit, initialData, isLoading, error }) => {
  const [formData, setFormData] = useState({
    facility_id: '',
    contact_name: '',
    contact_phone: '',
    contact_role: '',
    is_primary: false,
  });

  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        facility_id: initialData.facility_id || '',
        contact_name: initialData.contact_name || '',
        contact_phone: initialData.contact_phone || '',
        contact_role: initialData.contact_role || '',
        is_primary: initialData.is_primary !== undefined ? initialData.is_primary : false,
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

    if (!formData.contact_name || !formData.contact_name.trim()) {
      errors.push('Contact name is required');
    }

    if (!formData.contact_phone || !formData.contact_phone.trim()) {
      errors.push('Contact phone is required');
    } else if (!/^[0-9+()\-\s]*$/.test(formData.contact_phone)) {
      errors.push('Contact phone format is invalid');
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
    };

    onSubmit(submitData);
  };

  const handleReset = () => {
    setFormData({
      facility_id: '',
      contact_name: '',
      contact_phone: '',
      contact_role: '',
      is_primary: false,
    });
    setValidationErrors([]);
  };

  return (
    <form className="emergency-contact-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Update Emergency Contact' : 'Add Emergency Contact'}</h2>

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
        <label htmlFor="contact_name">Contact Name *</label>
        <input
          type="text"
          id="contact_name"
          name="contact_name"
          value={formData.contact_name}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter contact name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="contact_phone">Contact Phone *</label>
        <input
          type="tel"
          id="contact_phone"
          name="contact_phone"
          value={formData.contact_phone}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter contact phone"
        />
      </div>

      <div className="form-group">
        <label htmlFor="contact_role">Contact Role</label>
        <input
          type="text"
          id="contact_role"
          name="contact_role"
          value={formData.contact_role}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="e.g. Director, Manager"
        />
      </div>

      <div className="form-group form-group-checkbox">
        <label htmlFor="is_primary">
          <input
            type="checkbox"
            id="is_primary"
            name="is_primary"
            checked={formData.is_primary}
            onChange={handleChange}
            disabled={isLoading}
          />
          Primary Contact
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? 'Saving...' : initialData ? 'Update Emergency Contact' : 'Add Emergency Contact'}
        </button>
        <button type="button" disabled={isLoading} className="btn btn-secondary" onClick={handleReset}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default EmergencyContactForm;
