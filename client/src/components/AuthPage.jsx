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

      if (data.token) {
        localStorage.setItem('shelterx-token', data.token);
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
        <div className="auth-layout">
          <section className="auth-intro">
            <p className="auth-eyebrow">Support is closer than you think</p>
            <h1>Find your next step with ShelterX.</h1>
            <p className="auth-intro-copy">
              Sign in to continue to your account, or create one to connect with local support.
            </p>
          </section>

          <section className="auth-card" aria-live="polite">
            <p className="auth-eyebrow">{mode === 'login' ? 'Welcome back' : 'Get started'}</p>
            <h2>{mode === 'login' ? 'Sign in to ShelterX' : 'Create your account'}</h2>

          <div className="auth-toggle" role="group" aria-label="Authentication mode">
            <button
              type="button"
              className={mode === 'login' ? 'auth-toggle-button active' : 'auth-toggle-button'}
              aria-pressed={mode === 'login'}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'auth-toggle-button active' : 'auth-toggle-button'}
              aria-pressed={mode === 'register'}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          <form onSubmit={submitAuth} className="auth-form" aria-busy={loading}>
            {mode === 'register' && (
              <label className="auth-field">
                <span>Full name</span>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  autoComplete="name"
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
                autoComplete="email"
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
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="Enter your password"
                required
              />
            </label>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              <span>{loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}</span>
              {!loading && <span aria-hidden="true">-&gt;</span>}
            </button>
          </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
