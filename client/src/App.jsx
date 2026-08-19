import { useState, useEffect } from 'react';
import FacilityForm from './components/FacilityForm';
import FacilityList from './components/FacilityList';
import FacilityDetail from './components/FacilityDetail';
import { getFacilities, createFacility, updateFacility, deleteFacility } from './services/facilityService';
import './App.css';

function App() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch facilities on component mount
  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFacilities();
      setFacilities(data || []);
    } catch (err) {
      setError('Failed to load facilities. Please check if the backend is running on http://localhost:5000');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      if (editingId) {
        // Update existing facility
        await updateFacility(editingId, formData);
        setSuccessMessage('Facility updated successfully!');
        setEditingId(null);
      } else {
        // Create new facility
        await createFacility(formData);
        setSuccessMessage('Facility created successfully!');
      }

      // Refresh the facility list
      await fetchFacilities();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to save facility');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (facility) => {
    setEditingId(facility.facility_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteFacility(id);
      setSuccessMessage('Facility deleted successfully!');
      await fetchFacilities();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete facility');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    setViewingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormError(null);
  };

  const editingData = editingId ? facilities.find((s) => s.facility_id === editingId) : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1>🏠 ShelterX Finder</h1>
            <p>Manage shelters, food banks, and emergency support centers across your region</p>
          </div>
          {editingId && (
            <button className="btn btn-secondary-header" onClick={handleCancelEdit}>
              ✕ Cancel Edit
            </button>
          )}
        </div>
      </header>

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
            <FacilityForm
              onSubmit={handleFormSubmit}
              initialData={editingData}
              isLoading={formLoading}
              error={formError}
            />
          </aside>

          <section className="main-content">
            <FacilityList
              facilities={facilities}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              isLoading={loading}
            />
          </section>
        </div>
      </main>

      {viewingId && (
        <FacilityDetail
          facilityId={viewingId}
          onClose={() => setViewingId(null)}
          isLoading={loading}
        />
      )}
    </div>
  );
}

export default App;
