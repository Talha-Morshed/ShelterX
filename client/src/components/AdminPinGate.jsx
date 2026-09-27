import { useState } from 'react';
import './AdminPinGate.css';

const AdminPinGate = ({ onSuccess, onCancel }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiBaseUrl}/users/admin-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Unable to verify admin PIN.');

      localStorage.setItem('shelterx-token', data.token);
      onSuccess();
    } catch (submitError) {
      setError(submitError.message || 'Unable to reach the server.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const nextPin = event.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(nextPin);
    setError('');
  };

  return (
    <div className="admin-pin-page">
      <main className="admin-pin-card" aria-labelledby="admin-pin-heading">
        <div className="admin-pin-mark" aria-hidden="true">S</div>
        <p className="admin-pin-eyebrow">ShelterX administration</p>
        <h1 id="admin-pin-heading">Enter admin PIN</h1>
        <p className="admin-pin-description">This area is restricted to dashboard staff.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-pin">4-digit PIN</label>
          <input
            id="admin-pin"
            name="admin-pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength="4"
            autoComplete="off"
            value={pin}
            onChange={handleChange}
            aria-describedby={error ? 'admin-pin-error' : undefined}
            autoFocus
          />
          {error && <p className="admin-pin-error" id="admin-pin-error" role="alert">{error}</p>}
          <button type="submit" className="admin-pin-submit" disabled={pin.length !== 4 || loading}>
            {loading ? 'Verifying...' : 'Continue to dashboard'}
          </button>
          <button type="button" className="admin-pin-cancel" onClick={onCancel}>
            Back to public site
          </button>
        </form>
      </main>
    </div>
  );
};

export default AdminPinGate;
