import { useState, useEffect } from 'react';
import './FacilityForm.css';

const FacilityForm = ({ onSubmit, initialData, isLoading, error }) => {
  const [formData, setFormData] = useState({
    facility_name: '',
    facility_type: '',
    address: '',
    city: '',
    phone: '',
    capacity: '',
    available_spaces: '',
    description: '',
    latitude: '',
    longitude: '',
  });

  const [validationErrors, setValidationErrors] = useState([]);

  // Populate form with existing data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        facility_name: initialData.facility_name ?? '',
        facility_type: initialData.facility_type ?? '',
        address: initialData.address ?? '',
        city: initialData.city ?? '',
        phone: initialData.phone ?? '',
        capacity: initialData.capacity ?? '',
        available_spaces: initialData.available_spaces ?? '',
        description: initialData.description ?? '',
        latitude: initialData.latitude ?? '',
        longitude: initialData.longitude ?? '',
      });
    } else {
      setFormData({
        facility_name: '',
        facility_type: '',
        address: '',
        city: '',
        phone: '',
        capacity: '',
        available_spaces: '',
        description: '',
        latitude: '',
        longitude: '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const errors = [];

      if (!formData.facility_name || !formData.facility_name.trim()) {
        errors.push('Facility name is required');
    }

    if (!formData.facility_type || !formData.facility_type.trim()) {
      errors.push('Facility type is required');
    }

    if (!formData.address || !formData.address.trim()) {
      errors.push('Address is required');
    }

    if (!formData.city || !formData.city.trim()) {
      errors.push('City is required');
    }

    if (formData.capacity === '' || formData.capacity === null) {
      errors.push('Capacity is required');
    } else if (Number(formData.capacity) < 0) {
      errors.push('Capacity cannot be negative');
    }

    if (formData.available_spaces === '' || formData.available_spaces === null) {
      errors.push('Available spaces is required');
    } else if (Number(formData.available_spaces) < 0) {
      errors.push('Available spaces cannot be negative');
    }

    if (Number(formData.available_spaces) > Number(formData.capacity)) {
      errors.push('Available spaces cannot exceed capacity');
    }

    if (formData.phone && !/^[0-9+()\-\s]*$/.test(formData.phone)) {
      errors.push('Phone format is invalid');
    }

    if (formData.latitude && (Number(formData.latitude) < -90 || Number(formData.latitude) > 90)) {
      errors.push('Latitude must be between -90 and 90');
    }

    if (formData.longitude && (Number(formData.longitude) < -180 || Number(formData.longitude) > 180)) {
      errors.push('Longitude must be between -180 and 180');
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
    // Clear validation errors when user starts typing
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
      facility_name: '',
      facility_type: '',
      address: '',
      city: '',
      phone: '',
      capacity: '',
      available_spaces: '',
      description: '',
      latitude: '',
      longitude: '',
    });
    setValidationErrors([]);
  };

  return (
    <form className="facility-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Update Facility' : 'Add Facility'}</h2>

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
        <label htmlFor="facility_name">Name *</label>
        <input
          type="text"
          id="facility_name"
          name="facility_name"
          value={formData.facility_name}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter facility name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="facility_type">Type *</label>
        <select
          id="facility_type"
          name="facility_type"
          value={formData.facility_type}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">Select a type</option>
          <option value="shelter">Shelter</option>
          <option value="food_bank">Food Bank</option>
          <option value="medical">Medical/Clinic</option>
          <option value="emergency_center">Emergency Center</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="address">Address *</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter street address"
        />
      </div>

      <div className="form-group">
        <label htmlFor="city">City *</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter city"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter phone number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="capacity">Capacity *</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          disabled={isLoading}
          min="0"
          placeholder="Enter total capacity"
        />
      </div>

      <div className="form-group">
        <label htmlFor="available_spaces">Available Spaces *</label>
        <input
          type="number"
          id="available_spaces"
          name="available_spaces"
          value={formData.available_spaces}
          onChange={handleChange}
          disabled={isLoading}
          min="0"
          placeholder="Enter available spaces"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter description"
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            disabled={isLoading}
            step="0.0001"
            placeholder="-90 to 90"
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            disabled={isLoading}
            step="0.0001"
            placeholder="-180 to 180"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? 'Saving...' : initialData ? 'Update Facility' : 'Add Facility'}
        </button>
        <button type="button" disabled={isLoading} className="btn btn-secondary" onClick={handleReset}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default FacilityForm;
