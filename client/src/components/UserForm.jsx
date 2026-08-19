import { useState, useEffect } from 'react';
import './UserForm.css';

const UserForm = ({ onSubmit, initialData, isLoading, error }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
  });

  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name || '',
        email: initialData.email || '',
        password: '',
        phone: initialData.phone || '',
        role: initialData.role || 'user',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const errors = [];

    if (!formData.full_name || !formData.full_name.trim()) {
      errors.push('Full name is required');
    }

    if (!formData.email || !formData.email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Email format is invalid');
    }

    if (!initialData && (!formData.password || !formData.password.trim())) {
      errors.push('Password is required');
    }

    if (formData.phone && !/^[0-9+()\-\s]*$/.test(formData.phone)) {
      errors.push('Phone format is invalid');
    }

    if (formData.role && !['user', 'admin'].includes(formData.role)) {
      errors.push('Role must be either user or admin');
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

    const submitData = { ...formData };
    if (initialData && !submitData.password) {
      delete submitData.password;
    }

    onSubmit(submitData);
  };

  const handleReset = () => {
    setFormData({
      full_name: '',
      email: '',
      password: '',
      phone: '',
      role: 'user',
    });
    setValidationErrors([]);
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Update User' : 'Add User'}</h2>

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
        <label htmlFor="full_name">Full Name *</label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter full name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter email address"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">
          Password {!initialData ? '*' : '(leave blank to keep current)'}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          placeholder={initialData ? 'Leave blank to keep current' : 'Enter password'}
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
        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? 'Saving...' : initialData ? 'Update User' : 'Add User'}
        </button>
        <button type="button" disabled={isLoading} className="btn btn-secondary" onClick={handleReset}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default UserForm;
