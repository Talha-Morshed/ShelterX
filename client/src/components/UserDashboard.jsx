import './UserDashboard.css';

const UserDashboard = ({ user, onLogout, onHome, onFindHelp }) => {
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'User';

  return (
    <div className="user-dashboard-shell">
      <header className="user-dashboard-header">
        <div className="user-brand-wrap">
          <button type="button" className="public-brand" onClick={onHome}>
            <span className="public-brand-mark">S</span>
            <span>ShelterX</span>
          </button>
        </div>

        <nav className="user-dashboard-nav" aria-label="User dashboard navigation">
          <button type="button" className="public-nav-link" onClick={onFindHelp}>Find Help</button>
          <button type="button" className="public-nav-link" onClick={onHome}>Home</button>
          <button type="button" className="public-nav-link public-admin-link" onClick={onLogout}>Logout</button>
        </nav>
      </header>

      <main className="user-dashboard-main">
        <section className="user-welcome-card">
          <p className="public-eyebrow">Protected user portal</p>
          <h1>Welcome back, {firstName}</h1>
          <p>
            Your account is protected and only visible after successful login. You can browse support facilities, explore local resources, and return to the public home any time.
          </p>
        </section>

        <section className="user-dashboard-grid">
          <article className="user-stat-card">
            <span className="user-stat-label">Account</span>
            <strong>{user?.full_name || 'ShelterX Member'}</strong>
            <small>{user?.email || 'No email available'}</small>
          </article>

          <article className="user-stat-card">
            <span className="user-stat-label">Access level</span>
            <strong>User</strong>
            <small>Authenticated access only</small>
          </article>

          <article className="user-stat-card">
            <span className="user-stat-label">Support tools</span>
            <strong>Available</strong>
            <small>Browse shelters and services</small>
          </article>
        </section>

        <section className="user-actions-panel">
          <button type="button" className="user-primary-button" onClick={onFindHelp}>Browse facilities</button>
          <button type="button" className="user-secondary-button" onClick={onHome}>Return home</button>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
