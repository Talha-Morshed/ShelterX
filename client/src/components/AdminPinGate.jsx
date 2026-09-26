import { useState } from 'react';
import './AdminPinGate.css';

const ADMIN_PIN = '1234';

const AdminPinGate = ({ onSuccess, onCancel }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (pin === ADMIN_PIN) {
      onSuccess();
      return;
    }

    setError('Incorrect PIN. Please try again.');
    setPin('');
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
          <button type="submit" className="admin-pin-submit" disabled={pin.length !== 4}>
            Continue to dashboard
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
