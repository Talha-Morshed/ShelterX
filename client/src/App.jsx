import { useState, useEffect, useCallback } from 'react';
import FacilityForm from './components/FacilityForm';
import FacilityList from './components/FacilityList';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import ServiceForm from './components/ServiceForm';
import ServiceList from './components/ServiceList';
import FacilityServiceForm from './components/FacilityServiceForm';
import FacilityServiceList from './components/FacilityServiceList';
import ReviewForm from './components/ReviewForm';
import ReviewList from './components/ReviewList';
import DonationForm from './components/DonationForm';
import DonationList from './components/DonationList';
import VolunteerForm from './components/VolunteerForm';
import VolunteerList from './components/VolunteerList';
import EmergencyContactForm from './components/EmergencyContactForm';
import EmergencyContactList from './components/EmergencyContactList';
import { createFacility, updateFacility, deleteFacility } from './services/facilityService';
import { createUser, updateUser, deleteUser } from './services/userService';
import { createService, updateService, deleteService, getServices } from './services/serviceService';
import { createFacilityService, updateFacilityService, deleteFacilityService, getFacilityServices } from './services/facilityServiceService';
import { createReview, updateReview, deleteReview, getReviews } from './services/reviewService';
import { createDonation, updateDonation, deleteDonation } from './services/donationService';
import { createVolunteer, updateVolunteer, deleteVolunteer, getVolunteers } from './services/volunteerService';
import { createEmergencyContact, updateEmergencyContact, deleteEmergencyContact, getEmergencyContacts } from './services/emergencyContactService';
import { getFacilitiesWithReviews } from './services/facilityReviewService';
import { getUsersWithReviews } from './services/userReviewService';
import { getFacilitiesAndDonations } from './services/facilityDonationService';
import './App.css';

const TABS = [
  { key: 'facilities', label: 'Facilities' },
  { key: 'users', label: 'Users' },
  { key: 'services', label: 'Services' },
  { key: 'facilityServices', label: 'Facility Services' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'donations', label: 'Donations' },
  { key: 'volunteers', label: 'Volunteers' },
  { key: 'emergencyContacts', label: 'Emergency Contacts' },
];

const ID_KEYS = {
  facilities: 'facility_id',
  users: 'user_id',
  services: 'service_id',
  facilityServices: 'id',
  reviews: 'review_id',
  donations: 'donation_id',
  volunteers: 'volunteer_id',
  emergencyContacts: 'contact_id',
};

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('facilities');

  const [facilities, setFacilities] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [facilityServices, setFacilityServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchMap = {
    facilities: async () => { const d = await getFacilitiesWithReviews(); setFacilities(d || []); },
    users: async () => { const d = await getUsersWithReviews(); setUsers(d || []); },
    services: async () => { const d = await getServices(); setServices(d || []); },
    facilityServices: async () => { const d = await getFacilityServices(); setFacilityServices(d || []); },
    reviews: async () => { const d = await getReviews(); setReviews(d || []); },
    donations: async () => { const d = await getFacilitiesAndDonations(); setDonations(d || []); },
    volunteers: async () => { const d = await getVolunteers(); setVolunteers(d || []); },
    emergencyContacts: async () => { const d = await getEmergencyContacts(); setEmergencyContacts(d || []); },
  };

  const createMap = {
    facilities: createFacility,
    users: createUser,
    services: createService,
    facilityServices: createFacilityService,
    reviews: createReview,
    donations: createDonation,
    volunteers: createVolunteer,
    emergencyContacts: createEmergencyContact,
  };

  const updateMap = {
    facilities: updateFacility,
    users: updateUser,
    services: updateService,
    facilityServices: updateFacilityService,
    reviews: updateReview,
    donations: updateDonation,
    volunteers: updateVolunteer,
    emergencyContacts: updateEmergencyContact,
  };

  const deleteMap = {
    facilities: deleteFacility,
    users: deleteUser,
    services: deleteService,
    facilityServices: deleteFacilityService,
    reviews: deleteReview,
    donations: deleteDonation,
    volunteers: deleteVolunteer,
    emergencyContacts: deleteEmergencyContact,
  };

  const dataMap = {
    facilities, users, services, facilityServices, reviews, donations, volunteers, emergencyContacts,
  };

  const labelMap = {
    facilities: 'Facility',
    users: 'User',
    services: 'Service',
    facilityServices: 'Facility Service',
    reviews: 'Review',
    donations: 'Donation',
    volunteers: 'Volunteer',
    emergencyContacts: 'Emergency Contact',
  };

  const fetchData = useCallback(async (tab) => {
    setLoading(true);
    setError(null);
    try {
      await fetchMap[tab]();
    } catch (err) {
      setError(`Failed to load ${labelMap[tab]}s. Is the backend running on http://localhost:5000?`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!showLanding) {
      fetchData(activeTab);
    }
  }, [activeTab, fetchData, showLanding]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEditingId(null);
    setFormError(null);
    setError(null);
  };

  const handleStartDashboard = () => {
    setShowLanding(false);
    setActiveTab('facilities');
    setEditingId(null);
    setFormError(null);
    setError(null);
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const label = labelMap[activeTab];
      if (editingId) {
        await updateMap[activeTab](editingId, formData);
        setSuccessMessage(`${label} updated successfully!`);
        setEditingId(null);
      } else {
        await createMap[activeTab](formData);
        setSuccessMessage(`${label} created successfully!`);
      }
      await fetchData(activeTab);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to save');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (item) => {
    const idKey = ID_KEYS[activeTab];
    setEditingId(item[idKey]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const label = labelMap[activeTab];
      await deleteMap[activeTab](id);
      setSuccessMessage(`${label} deleted successfully!`);
      await fetchData(activeTab);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormError(null);
  };

  const editingData = editingId
    ? (dataMap[activeTab] || []).find((item) => item[ID_KEYS[activeTab]] === editingId)
    : null;

  const renderForm = () => {
    const props = {
      onSubmit: handleFormSubmit,
      initialData: editingData,
      isLoading: formLoading,
      error: formError,
    };
    switch (activeTab) {
      case 'facilities': return <FacilityForm {...props} />;
      case 'users': return <UserForm {...props} />;
      case 'services': return <ServiceForm {...props} />;
      case 'facilityServices': return <FacilityServiceForm {...props} />;
      case 'reviews': return <ReviewForm {...props} facilities={facilities} users={users} />;
      case 'donations': return <DonationForm {...props} />;
      case 'volunteers': return <VolunteerForm {...props} />;
      case 'emergencyContacts': return <EmergencyContactForm {...props} />;
      default: return null;
    }
  };

  const renderList = () => {
    const commonProps = {
      onEdit: handleEdit,
      onDelete: handleDelete,
      isLoading: loading,
    };
    switch (activeTab) {
      case 'facilities': return <FacilityList facilities={facilities} {...commonProps} />;
      case 'users': return <UserList users={users} {...commonProps} />;
      case 'services': return <ServiceList services={services} {...commonProps} />;
      case 'facilityServices': return <FacilityServiceList facilityServices={facilityServices} {...commonProps} />;
      case 'reviews': return <ReviewList reviews={reviews} {...commonProps} />;
      case 'donations': return <DonationList donations={donations} {...commonProps} />;
      case 'volunteers': return <VolunteerList volunteers={volunteers} {...commonProps} />;
      case 'emergencyContacts': return <EmergencyContactList emergencyContacts={emergencyContacts} {...commonProps} />;
      default: return null;
    }
  };

  if (showLanding) {
    return (
      <div className="landing-page">
        <header className="landing-header">
          <div className="container landing-nav">
            <div className="brand-mark">
              <div className="brand-icon">S</div>
              <div>
                <span className="brand-name">ShelterX</span>
                <span className="brand-tag">Operations Suite</span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleStartDashboard}>
              Get Started
            </button>
          </div>
        </header>

        <main className="landing-main">
          <section className="hero-section container">
            <div className="hero-copy">
              <span className="eyebrow">Trusted shelter operations platform</span>
              <h1>Manage every shelter touchpoint with clarity and confidence.</h1>
              <p>
                From facilities and services to donations, volunteers, and emergency response,
                ShelterX gives your team one premium control center for real-world support work.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary btn-hero" onClick={handleStartDashboard}>Get Started</button>
                <button className="btn btn-secondary landing-secondary" onClick={handleStartDashboard}>Open Dashboard</button>
              </div>
              <div className="hero-metrics">
                <div>
                  <strong>8</strong>
                  <span>Core modules</span>
                </div>
                <div>
                  <strong>24/7</strong>
                  <span>Operations view</span>
                </div>
                <div>
                  <strong>100%</strong>
                  <span>Staff visibility</span>
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-label="ShelterX dashboard preview">
              <div className="glass-panel primary-panel">
                <div className="panel-topbar">
                  <span className="pulse-dot" />
                  <span className="pulse-dot" />
                  <span className="pulse-dot" />
                </div>
                <div className="mini-header">
                  <span>Facility Overview</span>
                  <span className="mini-badge">Live</span>
                </div>
                <div className="mini-stats">
                  <div>
                    <small>Active</small>
                    <strong>128</strong>
                  </div>
                  <div>
                    <small>Donations</small>
                    <strong>$84k</strong>
                  </div>
                  <div>
                    <small>Volunteers</small>
                    <strong>346</strong>
                  </div>
                </div>
                <div className="mini-chart">
                  <span style={{ height: '26%' }} />
                  <span style={{ height: '38%' }} />
                  <span style={{ height: '56%' }} />
                  <span style={{ height: '74%' }} />
                  <span style={{ height: '92%' }} />
                  <span style={{ height: '80%' }} />
                </div>
              </div>

              <div className="floating-card card-one">
                <span className="card-label">Capacity</span>
                <strong>94%</strong>
                <small>Across active facilities</small>
              </div>

              <div className="floating-card card-two">
                <span className="card-label">Urgent tasks</span>
                <strong>7</strong>
                <small>Need immediate response</small>
              </div>
            </div>
          </section>

          <section className="features-section container">
            <div className="section-heading">
              <span className="eyebrow">What ShelterX manages</span>
              <h2>Built for the full support ecosystem.</h2>
            </div>

            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-icon teal">F</div>
                <h3>Facilities</h3>
                <p>Track shelter availability, capacity, and community location data with precision.</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon blue">S</div>
                <h3>Services</h3>
                <p>Manage service offerings across shelter programs and value streams.</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon gold">D</div>
                <h3>Donations</h3>
                <p>Monitor giving patterns and see how support moves across your network.</p>
              </article>
              <article className="feature-card">
                <div className="feature-icon mint">V</div>
                <h3>Volunteers</h3>
                <p>Coordinate staffing, schedules, and engagement for critical daily operations.</p>
              </article>
            </div>
          </section>

          <section className="showcase-section container">
            <div className="showcase-panel">
              <div className="showcase-copy">
                <span className="eyebrow">A single operational view</span>
                <h2>Everything your shelter network needs, in one premium workspace.</h2>
                <ul className="check-list">
                  <li>Facility management with review and capacity insights.</li>
                  <li>Donation tracking with relationship and volume visibility.</li>
                  <li>Volunteer and emergency coordination aligned to service delivery.</li>
                  <li>Professional dashboard structure for fast operational decisions.</li>
                </ul>
              </div>

              <div className="showcase-stack">
                <div className="stack-card stack-main">
                  <div className="stack-row">
                    <span>Facilities</span>
                    <strong>128</strong>
                  </div>
                  <div className="stack-row">
                    <span>Volunteers</span>
                    <strong>346</strong>
                  </div>
                  <div className="stack-row">
                    <span>Emergency contacts</span>
                    <strong>54</strong>
                  </div>
                </div>
                <div className="stack-card stack-brief">
                  <small>Response readiness</small>
                  <strong>96%</strong>
                  <span>Operations healthy</span>
                </div>
              </div>
            </div>
          </section>

          <section className="steps-section container">
            <div className="section-heading center">
              <span className="eyebrow">How it flows</span>
              <h2>From intake to action in three thoughtful steps.</h2>
            </div>

            <div className="steps-grid">
              <div className="step-card">
                <span className="step-number">01</span>
                <h3>Collect</h3>
                <p>Capture facilities, services, donors, and support contacts into one clear system.</p>
              </div>
              <div className="step-card">
                <span className="step-number">02</span>
                <h3>Review</h3>
                <p>Understand capacity, quality insights, and service trends before acting.</p>
              </div>
              <div className="step-card">
                <span className="step-number">03</span>
                <h3>Respond</h3>
                <p>Move quickly with volunteer coordination, review intelligence, and support updates.</p>
              </div>
            </div>
          </section>

          <section className="cta-section container">
            <div className="cta-panel">
              <div>
                <span className="eyebrow">Ready to operate smarter?</span>
                <h2>Enter the dashboard and continue managing your outreach.</h2>
              </div>
              <button className="btn btn-primary btn-hero" onClick={handleStartDashboard}>Get Started</button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1>ShelterX Finder</h1>
            <p>Manage facilities, services, donations, volunteers, and more</p>
          </div>
          {editingId && (
            <button className="btn btn-secondary-header" onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </header>

      <nav className="tab-nav" aria-label="Primary">
        <div className="container">
          <div className="tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                className={`tab ${activeTab === tab.key ? 'tab-active' : ''}`}
                onClick={() => handleTabChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container">
        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        <div className="app-grid">
          <aside className="sidebar">
            {renderForm()}
          </aside>

          <section className="main-content">
            {renderList()}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
