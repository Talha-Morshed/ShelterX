import { useState } from 'react';
import './AuthPage.css';

const initialForm = {
  full_name: '',
  email: '',
  password: '',
};

const AuthPage = ({ onLoginSuccess, onGoHome, onOpenAdmin }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/api/users/login' : '/api/users/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { full_name: form.full_name, email: form.email, password: form.password, role: 'user' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      const user = data.user || { full_name: form.full_name || 'User' };
      onLoginSuccess(user, mode);
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <header className="auth-topbar">
        <button type="button" className="public-brand" onClick={onGoHome}>
          <span className="public-brand-mark">S</span>
          <span>ShelterX</span>
        </button>
        <nav className="public-nav" aria-label="Auth navigation">
          <button type="button" className="public-nav-link" onClick={onGoHome}>Home</button>
          <button type="button" className="public-nav-link public-admin-link" onClick={onOpenAdmin}>Admin Dashboard</button>
        </nav>
      </header>

      <main className="auth-main">
        <section className="auth-card" aria-live="polite">
          <p className="auth-eyebrow">{mode === 'login' ? 'Welcome back' : 'Create your account'}</p>
          <h1>{mode === 'login' ? 'User login' : 'User registration'}</h1>

          <div className="auth-toggle" role="tablist" aria-label="Authentication mode switcher">
            <button
              type="button"
              className={mode === 'login' ? 'auth-toggle-button active' : 'auth-toggle-button'}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'auth-toggle-button active' : 'auth-toggle-button'}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          <form onSubmit={submitAuth} className="auth-form">
            {mode === 'register' && (
              <label className="auth-field">
                <span>Full name</span>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Adnan Rahman"
                  required
                />
              </label>
            )}

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AuthPage;
