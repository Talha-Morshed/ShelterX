import { useEffect, useRef, useState } from 'react';
import { getFacilityCapacityHistory } from '../services/facilityService';
import './FacilityList.css';

const FacilityList = ({ facilities, onEdit, onDelete, _onView, isLoading }) => {
  const [historyFacility, setHistoryFacility] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const historyDialogRef = useRef(null);

  useEffect(() => {
    const dialog = historyDialogRef.current;
    if (historyFacility && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!historyFacility && dialog?.open) {
      dialog.close();
    }
  }, [historyFacility]);

  const handleViewHistory = async (facility) => {
    setHistoryFacility(facility);
    setHistoryRecords([]);
    setHistoryError('');
    setHistoryLoading(true);

    try {
      const records = await getFacilityCapacityHistory(facility.facility_id);
      setHistoryRecords(records);
    } catch {
      setHistoryError('Unable to load capacity history.');
    } finally {
      setHistoryLoading(false);
    }
  };

  const closeHistory = () => {
    setHistoryFacility(null);
    setHistoryRecords([]);
    setHistoryError('');
  };

  const formatDateTime = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  };

  const renderValueChange = (oldValue, newValue) => {
    const unchanged = Number(oldValue) === Number(newValue);
    return (
      <span className="capacity-history-change">
        <span>{oldValue}</span>
        <span aria-hidden="true"> &rarr; </span>
        <span>{newValue}</span>
        {unchanged && <small>Unchanged</small>}
      </span>
    );
  };

  if (isLoading) {
    return <div className="loading">Loading facilities...</div>;
  }

  if (!facilities || facilities.length === 0) {
    return <div className="no-facilities">No facilities found. Add one to get started!</div>;
  }

  return (
    <div className="facility-list">
      <h2>Facilities <span className="join-badge">LEFT JOIN</span></h2>
      <p className="join-hint">Shows all facilities with review stats. Facilities with 0 reviews still appear.</p>
      <div className="facility-cards">
        {facilities.map((facility) => (
          <div key={facility.facility_id} className={`facility-card ${facility.total_reviews === 0 ? 'card-highlight' : ''}`}>
            <div className="facility-header">
              <h3>{facility.facility_name}</h3>
              <span className="facility-id">#{facility.facility_id}</span>
              <span className="facility-type">{facility.facility_type}</span>
            </div>

            <div className="facility-info">
              <div className="info-row">
                <span className="label">City:</span>
                <span className="value">{facility.city}</span>
              </div>
              {facility.address && (
                <div className="info-row">
                  <span className="label">Address:</span>
                  <span className="value">{facility.address}</span>
                </div>
              )}
              {facility.phone && (
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">{facility.phone}</span>
                </div>
              )}
              {facility.capacity !== undefined && (
                <div className="info-row">
                  <span className="label">Capacity:</span>
                  <span className="value">{facility.capacity}</span>
                </div>
              )}
              {facility.available_spaces !== undefined && (
                <div className="info-row">
                  <span className="label">Available Spaces:</span>
                  <span className="value">{facility.available_spaces}</span>
                </div>
              )}
              {facility.total_reviews !== undefined && (
                <div className="info-row">
                  <span className="label">Reviews:</span>
                  <span className="value">{facility.total_reviews}</span>
                </div>
              )}
              {facility.avg_rating !== undefined && facility.avg_rating !== null && (
                <div className="info-row">
                  <span className="label">Avg Rating:</span>
                  <span className="value">{facility.avg_rating} / 5</span>
                </div>
              )}
              {facility.total_reviews === 0 && facility.avg_rating === null && (
                <div className="info-row">
                  <span className="label">Note:</span>
                  <span className="value null-value">No reviews yet (NULL from LEFT JOIN)</span>
                </div>
              )}
            </div>

            <div className="facility-actions">
              <button className="btn btn-warning" onClick={() => onEdit(facility)}>
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${facility.facility_name}"?`)) {
                    onDelete(facility.facility_id);
                  }
                }}
              >
                Delete
              </button>
              <button className="btn btn-secondary" onClick={() => handleViewHistory(facility)}>
                View History
              </button>
            </div>
          </div>
        ))}
      </div>
      <dialog
        className="capacity-history-dialog"
        ref={historyDialogRef}
        aria-labelledby="capacity-history-title"
        onClose={closeHistory}
      >
        {historyFacility && (
          <div className="capacity-history-content">
            <header className="capacity-history-header">
              <div>
                <p className="capacity-history-eyebrow">Facility audit</p>
                <h2 id="capacity-history-title">{historyFacility.facility_name}</h2>
              </div>
              <button type="button" className="btn btn-secondary" onClick={closeHistory}>
                Close
              </button>
            </header>

            <section className="capacity-history-current" aria-label="Current facility capacity">
              <div>
                <span>Capacity</span>
                <strong>{historyFacility.capacity}</strong>
              </div>
              <div>
                <span>Available Spaces</span>
                <strong>{historyFacility.available_spaces}</strong>
              </div>
            </section>

            <section className="capacity-history-results" aria-live="polite">
              {historyLoading && <p className="capacity-history-message">Loading capacity history...</p>}
              {!historyLoading && historyError && (
                <p className="capacity-history-message capacity-history-error" role="alert">{historyError}</p>
              )}
              {!historyLoading && !historyError && historyRecords.length === 0 && (
                <p className="capacity-history-message">No capacity changes recorded yet.</p>
              )}
              {!historyLoading && !historyError && historyRecords.length > 0 && (
                <div className="capacity-history-table-wrap">
                  <table className="capacity-history-table">
                    <thead>
                      <tr>
                        <th scope="col">Date &amp; Time</th>
                        <th scope="col">Capacity</th>
                        <th scope="col">Available Spaces</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyRecords.map((record) => (
                        <tr key={record.history_id}>
                          <td>{formatDateTime(record.changed_at)}</td>
                          <td>{renderValueChange(record.old_capacity, record.new_capacity)}</td>
                          <td>{renderValueChange(record.old_available_spaces, record.new_available_spaces)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </dialog>
    </div>
  );
};

export default FacilityList;
