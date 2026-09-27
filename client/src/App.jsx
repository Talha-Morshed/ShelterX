import { useState, useEffect, useCallback, useMemo } from 'react';
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
import PublicHome from './components/PublicHome';
import PublicFacilityBrowser from './components/PublicFacilityBrowser';
import PublicFacilityDetails from './components/PublicFacilityDetails';
import AdminPinGate from './components/AdminPinGate';
import AuthPage from './components/AuthPage';
import UserDashboard from './components/UserDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { createFacility, updateFacility, deleteFacility, getFacilities } from './services/facilityService';
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
  { key: 'analytics', label: 'Analytics' },
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
  analytics: 'id',
};

function App() {
  const [view, setView] = useState('public-home');
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [activeTab, setActiveTab] = useState('facilities');
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('shelterx-user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

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

  const fetchMap = useMemo(() => ({
    facilities: async () => { const d = await getFacilitiesWithReviews(); setFacilities(d || []); },
    users: async () => { const d = await getUsersWithReviews(); setUsers(d || []); },
    services: async () => { const d = await getServices(); setServices(d || []); },
    facilityServices: async () => {
      const [facilityServiceData, facilityData, serviceData] = await Promise.all([
        getFacilityServices(),
        getFacilities(),
        getServices(),
      ]);
      setFacilityServices(facilityServiceData || []);
      setFacilities(facilityData || []);
      setServices(serviceData || []);
    },
    reviews: async () => { const d = await getReviews(); setReviews(d || []); },
    donations: async () => { const d = await getFacilitiesAndDonations(); setDonations(d || []); },
    volunteers: async () => { const d = await getVolunteers(); setVolunteers(d || []); },
    emergencyContacts: async () => { const d = await getEmergencyContacts(); setEmergencyContacts(d || []); },
  }), []);

  const createMap = useMemo(() => ({
    facilities: createFacility,
    users: createUser,
    services: createService,
    facilityServices: createFacilityService,
    reviews: createReview,
    donations: createDonation,
    volunteers: createVolunteer,
    emergencyContacts: createEmergencyContact,
  }), []);

  const updateMap = useMemo(() => ({
    facilities: updateFacility,
    users: updateUser,
    services: updateService,
    facilityServices: updateFacilityService,
    reviews: updateReview,
    donations: updateDonation,
    volunteers: updateVolunteer,
    emergencyContacts: updateEmergencyContact,
  }), []);

  const deleteMap = useMemo(() => ({
    facilities: deleteFacility,
    users: deleteUser,
    services: deleteService,
    facilityServices: deleteFacilityService,
    reviews: deleteReview,
    donations: deleteDonation,
    volunteers: deleteVolunteer,
    emergencyContacts: deleteEmergencyContact,
  }), []);

  const dataMap = useMemo(() => ({
    facilities, users, services, facilityServices, reviews, donations, volunteers, emergencyContacts,
  }), [facilities, users, services, facilityServices, reviews, donations, volunteers, emergencyContacts]);

  const labelMap = useMemo(() => ({
    facilities: 'Facility',
    users: 'User',
    services: 'Service',
    facilityServices: 'Facility Service',
    reviews: 'Review',
    donations: 'Donation',
    volunteers: 'Volunteer',
    emergencyContacts: 'Emergency Contact',
    analytics: 'Analytics',
  }), []);

  const fetchData = useCallback(async (tab) => {
    if (tab === 'analytics') {
      return;
    }
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
  }, [fetchMap, labelMap]);

  useEffect(() => {
    if (view === 'admin-dashboard') {
      fetchData(activeTab);
    }
  }, [activeTab, fetchData, view]);

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('shelterx-user', JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem('shelterx-user');
    }
  }, [loggedInUser]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEditingId(null);
    setFormError(null);
    setError(null);
  };

  const handleAdminHome = () => {
    setView('admin-pin');
    setEditingId(null);
    setFormError(null);
    setError(null);
  };

  const handleAdminPinSuccess = () => {
    setView('admin-dashboard');
    setActiveTab('facilities');
    setEditingId(null);
    setFormError(null);
    setError(null);
  };

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    setView('user-dashboard');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('shelterx-token');
    setView('public-home');
  };

  const handleViewDetails = (facilityId) => {
    setSelectedFacilityId(facilityId);
    setView('public-facility-details');
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
      case 'facilityServices': return <FacilityServiceForm {...props} facilities={facilities} services={services} />;
      case 'reviews': return <ReviewForm {...props} facilities={facilities} users={users} />;
      case 'donations': return <DonationForm {...props} />;
      case 'volunteers': return <VolunteerForm {...props} />;
      case 'emergencyContacts': return <EmergencyContactForm {...props} />;
      case 'analytics': return null;
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
      case 'analytics': return <AnalyticsDashboard />;
      default: return null;
    }
  };

  if (view === 'public-home') {
    return (
      <PublicHome
        onFindHelp={() => setView('public-facilities')}
        onAdmin={handleAdminHome}
        onOpenAuth={() => setView('auth')}
        onOpenDashboard={() => setView('user-dashboard')}
        user={loggedInUser}
        onLogout={handleLogout}
      />
    );
  }

  if (view === 'auth') {
    return (
      <AuthPage
        onLoginSuccess={handleLoginSuccess}
        onGoHome={() => setView('public-home')}
        onOpenAdmin={handleAdminHome}
      />
    );
  }

  if (view === 'user-dashboard') {
    if (!loggedInUser) {
      return <AuthPage onLoginSuccess={handleLoginSuccess} onGoHome={() => setView('public-home')} onOpenAdmin={handleAdminHome} />;
    }

    return (
      <UserDashboard
        user={loggedInUser}
        onLogout={handleLogout}
        onHome={() => setView('public-home')}
        onFindHelp={() => setView('public-facilities')}
      />
    );
  }

  if (view === 'admin-pin') {
    return <AdminPinGate onSuccess={handleAdminPinSuccess} onCancel={() => setView('public-home')} />;
  }

  if (view === 'public-facilities') {
    return (
      <PublicFacilityBrowser
        onHome={() => setView('public-home')}
        onAdmin={handleAdminHome}
        onViewDetails={handleViewDetails}
      />
    );
  }

  if (view === 'public-facility-details') {
    return (
      <PublicFacilityDetails
        facilityId={selectedFacilityId}
        onBack={() => setView('public-facilities')}
        onHome={() => setView('public-home')}
        onAdmin={handleAdminHome}
      />
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
