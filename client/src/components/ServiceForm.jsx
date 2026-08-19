import { useState, useEffect } from 'react';
import './ServiceForm.css';

const ServiceForm = ({ onSubmit, initialData, isLoading, error }) => {
  const [formData, setFormData] = useState({
    service_name: '',
    service_description: '',
    category: '',
  });

  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        service_name: initialData.service_name || '',
        service_description: initialData.service_description || '',
        category: initialData.category || '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const errors = [];

    if (!formData.service_name || !formData.service_name.trim()) {
      errors.push('Service name is required');
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

    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      service_name: '',
      service_description: '',
      category: '',
    });
    setValidationErrors([]);
  };

  return (
    <form className="service-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Update Service' : 'Add Service'}</h2>

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
        <label htmlFor="service_name">Service Name *</label>
        <input
          type="text"
          id="service_name"
          name="service_name"
          value={formData.service_name}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter service name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="service_description">Description</label>
        <textarea
          id="service_description"
          name="service_description"
          value={formData.service_description}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter service description"
          rows="4"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter category"
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? 'Saving...' : initialData ? 'Update Service' : 'Add Service'}
        </button>
        <button type="button" disabled={isLoading} className="btn btn-secondary" onClick={handleReset}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
