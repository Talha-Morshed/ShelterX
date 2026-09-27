import { useState, useEffect } from 'react';
import { getMyVolunteerApplications, applyAsVolunteer } from '../services/volunteerService';
import { getFacilities } from '../services/facilityService';
import './UserDashboard.css';

const UserDashboard = ({ user, onLogout, onHome, onFindHelp, onViewDetails }) => {
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'User';

  const [applications, setApplications] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const [appsError, setAppsError] = useState('');

  // Quick application form state
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [volunteerRole, setVolunteerRole] = useState('');
  const [volunteerAvailability, setVolunteerAvailability] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadApplications = async () => {
    setIsLoadingApps(true);
    setAppsError('');
    try {
      const data = await getMyVolunteerApplications();
      setApplications(data || []);
    } catch (err) {
      setAppsError(err.message || 'Failed to load volunteer applications');
    } finally {
      setIsLoadingApps(false);
    }
  };

  useEffect(() => {
    loadApplications();

    getFacilities()
      .then((data) => {
        setFacilities((data || []).filter((f) => f.is_active));
      })
      .catch(() => {});
  }, []);

  const handleQuickApply = async (e) => {
    e.preventDefault();
    if (!selectedFacilityId) {
      setFormError('Please select a facility.');
      return;
    }
    if (!volunteerRole.trim()) {
      setFormError('Please specify a role.');
      return;
    }
    if (!volunteerAvailability.trim()) {
      setFormError('Please specify your availability.');
      return;
    }

    setSubmittingApp(true);
    setFormError('');
    setFormSuccess('');

    try {
      const res = await applyAsVolunteer({
        facility_id: Number(selectedFacilityId),
        role: volunteerRole.trim(),
        availability: volunteerAvailability.trim(),
      });
      setFormSuccess(res.message || 'Volunteer application submitted successfully!');
      setSelectedFacilityId('');
      setVolunteerRole('');
      setVolunteerAvailability('');
      await loadApplications();
    } catch (err) {
      setFormError(err.message || 'Failed to submit application.');
    } finally {
      setSubmittingApp(false);
    }
  };

  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;

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
          <p className="public-eyebrow">Volunteer &amp; Community Portal</p>
          <h1>Welcome back, {firstName}</h1>
          <p>
            Your account allows you to browse shelters and emergency facilities, submit volunteer applications, and track your application status.
          </p>
        </section>

        <section className="user-dashboard-grid">
          <article className="user-stat-card">
            <span className="user-stat-label">Account</span>
            <strong>{user?.full_name || 'ShelterX Member'}</strong>
            <small>{user?.email || 'No email available'}</small>
          </article>

          <article className="user-stat-card">
            <span className="user-stat-label">Volunteer Applications</span>
            <strong>{applications.length}</strong>
            <small>{approvedCount} approved, {pendingCount} pending</small>
          </article>

          <article className="user-stat-card">
            <span className="user-stat-label">Support Network</span>
            <strong>{facilities.length}</strong>
            <small>Active partner facilities</small>
          </article>
        </section>

        <section className="user-actions-panel">
          <button type="button" className="user-primary-button" onClick={onFindHelp}>Browse Facilities &amp; Apply</button>
          <button type="button" className="user-secondary-button" onClick={onHome}>Return Home</button>
        </section>
        {/* Volunteer Applications Section */}
        <section className="user-volunteer-dashboard-card">
          <div className="card-header-row">
            <div>
              <h2>My Volunteer Applications</h2>
              <p>Track the status of your volunteer requests across facilities.</p>
            </div>
            <button type="button" className="refresh-btn" onClick={loadApplications} disabled={isLoadingApps}>
              {isLoadingApps ? 'Refreshing...' : '↻ Refresh'}
            </button>
          </div>

          {appsError && <div className="alert-banner alert-banner-error">{appsError}</div>}

          {isLoadingApps ? (
            <p className="user-empty-state">Loading your applications...</p>
          ) : applications.length === 0 ? (
            <div className="user-empty-state-box">
              <p>You haven&apos;t applied to volunteer at any facility yet.</p>
              <small>Use the form below or browse facilities to submit your first application.</small>
            </div>
          ) : (
            <div className="user-applications-table-wrap">
              <table className="user-applications-table">
                <thead>
                  <tr>
                    <th>Facility</th>
                    <th>City</th>
                    <th>Role</th>
                    <th>Availability</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                    {onViewDetails && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.volunteer_id}>
                      <td>
                        <strong>{app.facility_name || `Facility #${app.facility_id}`}</strong>
                      </td>
                      <td>{app.city || '—'}</td>
                      <td>{app.role || 'General'}</td>
                      <td>{app.availability || 'Flexible'}</td>
                      <td>
                        <span className={`status-pill status-${app.status}`}>
                          {app.status ? app.status.toUpperCase() : 'PENDING'}
                        </span>
                      </td>
                      <td>
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : '—'}
                      </td>
                      {onViewDetails && (
                        <td>
                          <button
                            type="button"
                            className="btn-view-facility"
                            onClick={() => onViewDetails(app.facility_id)}
                          >
                            View Facility
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Apply to Volunteer Card */}
        <section className="user-volunteer-dashboard-card">
          <div className="card-header-row">
            <div>
              <h2>Apply to Volunteer</h2>
              <p>Select a facility and tell us how you can contribute.</p>
            </div>
          </div>

          {formSuccess && <div className="alert-banner alert-banner-success">{formSuccess}</div>}
          {formError && <div className="alert-banner alert-banner-error">{formError}</div>}

          <form className="user-apply-form" onSubmit={handleQuickApply}>
            <div className="user-form-grid">
              <div className="user-input-group">
                <label htmlFor="facility-select">Facility *</label>
                <select
                  id="facility-select"
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  required
                  disabled={submittingApp}
                >
                  <option value="">Select a facility</option>
                  {facilities.map((fac) => (
                    <option key={fac.facility_id} value={fac.facility_id}>
                      {fac.facility_name} ({fac.city || fac.facility_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="user-input-group">
                <label htmlFor="volunteer-quick-role">Role / Area of Interest *</label>
                <input
                  type="text"
                  id="volunteer-quick-role"
                  placeholder="e.g. Food Server, Front Desk, Tutor, Logistics"
                  value={volunteerRole}
                  onChange={(e) => setVolunteerRole(e.target.value)}
                  required
                  disabled={submittingApp}
                />
              </div>

              <div className="user-input-group full-width">
                <label htmlFor="volunteer-quick-avail">Availability *</label>
                <input
                  type="text"
                  id="volunteer-quick-avail"
                  placeholder="e.g. Saturdays 9AM - 1PM, Weekdays after 5PM, Flexible"
                  value={volunteerAvailability}
                  onChange={(e) => setVolunteerAvailability(e.target.value)}
                  required
                  disabled={submittingApp}
                />
              </div>
            </div>

            <div className="form-submit-row">
              <button
                type="submit"
                className="user-primary-button"
                disabled={submittingApp || !selectedFacilityId || !volunteerRole.trim() || !volunteerAvailability.trim()}
              >
                {submittingApp ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </section>

      </main>
    </div>
  );
};

export default UserDashboard;
