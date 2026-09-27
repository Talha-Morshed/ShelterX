import { useEffect, useState } from 'react';
import { getFacilityById } from '../services/facilityService';
import { getFacilityServicesByFacility } from '../services/facilityServiceService';
import { createFacilityReview, getReviewsByFacility } from '../services/reviewService';
import { applyAsVolunteer, getMyVolunteerApplications } from '../services/volunteerService';
import './PublicFacilityDetails.css';

const formatFacilityType = (type) => (type || 'Support facility').replaceAll('_', ' ');
const formatValue = (value) => value || 'Not provided';

const PublicFacilityDetails = ({ facilityId, user, onBack, onHome, onAdmin, onOpenAuth }) => {
  const [facility, setFacility] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [servicesError, setServicesError] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');
  const [reviewRating, setReviewRating] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  // Volunteer application state
  const [volunteerRole, setVolunteerRole] = useState('');
  const [volunteerAvailability, setVolunteerAvailability] = useState('');
  const [volunteerSubmitting, setVolunteerSubmitting] = useState(false);
  const [volunteerError, setVolunteerError] = useState('');
  const [volunteerSuccess, setVolunteerSuccess] = useState('');
  const [userVolunteerStatus, setUserVolunteerStatus] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadDetails = async () => {
      try {
        const facilityData = await getFacilityById(facilityId);
        if (!isMounted) return;

        if (!facilityData) {
          setIsLoading(false);
          return;
        }

        setFacility(facilityData);
        setIsLoading(false);

        try {
          const serviceData = await getFacilityServicesByFacility(facilityId);
          if (isMounted) {
            setServices(serviceData || []);
          }
        } catch (serviceError) {
          if (isMounted) {
            setServicesError(true);
          }
          console.error(serviceError);
        }
      } catch (loadError) {
        if (isMounted) {
          setError('We could not load this facility right now. Please try again later.');
          setIsLoading(false);
        }
        console.error(loadError);
      }
    };

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [facilityId]);

  useEffect(() => {
    let isMounted = true;
    setReviews([]);
    setReviewsError('');
    setReviewsLoading(true);

    getReviewsByFacility(facilityId)
      .then((data) => {
        if (isMounted) setReviews(data || []);
      })
      .catch((reviewError) => {
        if (isMounted) setReviewsError(reviewError.message || 'Unable to load facility reviews.');
      })
      .finally(() => {
        if (isMounted) setReviewsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [facilityId]);

  // Check if current logged-in user has already applied to this facility
  useEffect(() => {
    let isMounted = true;
    setUserVolunteerStatus(null);
    setVolunteerError('');
    setVolunteerSuccess('');

    if (user) {
      getMyVolunteerApplications()
        .then((apps) => {
          if (!isMounted) return;
          const match = (apps || []).find((a) => Number(a.facility_id) === Number(facilityId));
          if (match) {
            setUserVolunteerStatus(match);
          }
        })
        .catch(() => {
          // ignore background check failure
        });
    }

    return () => {
      isMounted = false;
    };
  }, [facilityId, user]);

  const handleVolunteerApply = async (event) => {
    event.preventDefault();
    if (!volunteerRole.trim()) {
      setVolunteerError('Please specify a role you wish to volunteer for.');
      return;
    }
    if (!volunteerAvailability.trim()) {
      setVolunteerError('Please specify your availability.');
      return;
    }

    setVolunteerSubmitting(true);
    setVolunteerError('');
    setVolunteerSuccess('');

    try {
      const res = await applyAsVolunteer({
        facility_id: Number(facilityId),
        role: volunteerRole.trim(),
        availability: volunteerAvailability.trim(),
      });
      setVolunteerSuccess(res.message || 'Volunteer application submitted successfully!');
      setUserVolunteerStatus(res.volunteer || { status: 'pending', role: volunteerRole, availability: volunteerAvailability });
      setVolunteerRole('');
      setVolunteerAvailability('');
    } catch (err) {
      setVolunteerError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setVolunteerSubmitting(false);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewSubmitting(true);
    setReviewsError('');
    setReviewMessage('');

    try {
      await createFacilityReview(facilityId, {
        rating: Number(reviewRating),
        comment: reviewComment,
      });
      const updatedReviews = await getReviewsByFacility(facilityId);
      setReviews(updatedReviews || []);
      setReviewRating('');
      setReviewComment('');
      setReviewMessage('Your review has been saved.');
    } catch (submitError) {
      setReviewsError(submitError.message || 'Unable to submit your review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const renderStatus = (isActive) => (
    <span className={`details-status ${isActive ? 'details-status-active' : 'details-status-inactive'}`}>
      {isActive ? 'Active' : 'Currently inactive'}
    </span>
  );

  return (
    <div className="public-shell public-details-page">
      <header className="public-header public-browser-header">
        <button type="button" className="public-brand" onClick={onHome}>
          <span className="public-brand-mark">S</span>
          <span>ShelterX</span>
        </button>
        <nav className="public-nav" aria-label="Public navigation">
          <button type="button" className="public-nav-link" onClick={onHome}>Home</button>
          <button type="button" className="public-nav-link public-admin-link" onClick={onAdmin}>Admin Dashboard</button>
        </nav>
      </header>

      <main className="public-details-main">
        <button type="button" className="details-back-link" onClick={onBack}>
          &lt;- Back to Find Help
        </button>

        {isLoading && (
          <div className="public-state public-loading-state" role="status">
            <span className="public-loader" aria-hidden="true" />
            <p>Loading facility details...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="public-state public-error-state" role="alert">
            <h1>Facility details are unavailable</h1>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && !facility && (
          <div className="public-state public-empty-state">
            <h1>Facility not found.</h1>
            <p>The support location you requested could not be found.</p>
          </div>
        )}

        {!isLoading && !error && facility && (
          <article className="details-card">
            <div className="details-hero">
              <div>
                <p className="public-eyebrow">Facility information</p>
                <h1>{facility.facility_name}</h1>
                <p className="details-type">{formatFacilityType(facility.facility_type)}</p>
              </div>
              {renderStatus(Boolean(Number(facility.is_active)))}
            </div>

            <div className="details-content">
              <section className="details-availability" aria-labelledby="availability-heading">
                <div>
                  <p className="public-eyebrow">Capacity</p>
                  <h2 id="availability-heading">{facility.available_spaces ?? 0} / {facility.capacity ?? 0} spaces available</h2>
                </div>
                <div className="details-capacity-track" aria-hidden="true">
                  <span style={{ width: `${facility.capacity > 0 ? Math.min(100, (facility.available_spaces / facility.capacity) * 100) : 0}%` }} />
                </div>
                <div className="details-capacity-numbers">
                  <span>Available spaces <strong>{facility.available_spaces ?? 0}</strong></span>
                  <span>Total capacity <strong>{facility.capacity ?? 0}</strong></span>
                </div>
              </section>

              <div className="details-columns">
                <section className="details-section" aria-labelledby="location-heading">
                  <p className="public-eyebrow">Location and contact</p>
                  <h2 id="location-heading">Reach this facility</h2>
                  <dl className="details-list">
                    <div>
                      <dt>Address</dt>
                      <dd>{formatValue(facility.address)}</dd>
                    </div>
                    <div>
                      <dt>City</dt>
                      <dd>{formatValue(facility.city)}</dd>
                    </div>
                    <div>
                      <dt>State</dt>
                      <dd>{formatValue(facility.state)}</dd>
                    </div>
                    <div>
                      <dt>ZIP Code</dt>
                      <dd>{formatValue(facility.zip_code)}</dd>
                    </div>
                    <div>
                      <dt>Phone</dt>
                      <dd>{facility.phone ? <a href={`tel:${facility.phone}`}>{facility.phone}</a> : 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{facility.email ? <a href={`mailto:${facility.email}`}>{facility.email}</a> : 'Not provided'}</dd>
                    </div>
                  </dl>
                </section>

                <section className="details-section" aria-labelledby="description-heading">
                  <p className="public-eyebrow">About this location</p>
                  <h2 id="description-heading">What to expect</h2>
                  <p className="details-description">{formatValue(facility.description)}</p>
                </section>
              </div>

              <section className="details-services" aria-labelledby="services-heading">
                <div>
                  <p className="public-eyebrow">Support offered</p>
                  <h2 id="services-heading">Services available</h2>
                </div>
                {servicesError && <p className="details-services-note">Services are temporarily unavailable.</p>}
                {!servicesError && services.length === 0 && <p className="details-services-note">No services are currently listed for this facility.</p>}
                {!servicesError && services.length > 0 && (
                  <ul className="details-service-list">
                    {services.map((service) => (
                      <li key={service.id}>
                        <span aria-hidden="true">+</span>
                        {service.service_name}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="details-reviews" aria-labelledby="reviews-heading">
                <div className="details-reviews-heading">
                  <div>
                    <p className="public-eyebrow">Community feedback</p>
                    <h2 id="reviews-heading">Reviews</h2>
                  </div>
                  <span>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
                </div>

                {reviewsLoading && <p className="details-services-note" role="status">Loading reviews...</p>}
                {reviewsError && <p className="details-review-error" role="alert">{reviewsError}</p>}
                {!reviewsLoading && !reviewsError && reviews.length === 0 && (
                  <p className="details-services-note">No reviews yet.</p>
                )}
                {!reviewsLoading && reviews.length > 0 && (
                  <div className="details-review-list">
                    {reviews.map((review) => (
                      <article className="details-review" key={review.review_id}>
                        <div className="details-review-heading">
                          <strong>{review.full_name || 'ShelterX user'}</strong>
                          <span>{review.rating} / 5</span>
                        </div>
                        {review.created_at && (
                          <time className="details-review-date" dateTime={review.created_at}>
                            {new Date(review.created_at).toLocaleDateString()}
                          </time>
                        )}
                        {review.comment && <p>{review.comment}</p>}
                      </article>
                    ))}
                  </div>
                )}

                {reviewMessage && <p className="details-review-success" role="status">{reviewMessage}</p>}
                {user ? (
                  <form className="details-review-form" onSubmit={handleReviewSubmit}>
                    <h3>Write a review</h3>
                    <label htmlFor="facility-review-rating">Rating</label>
                    <select
                      id="facility-review-rating"
                      name="rating"
                      value={reviewRating}
                      onChange={(event) => setReviewRating(event.target.value)}
                      required
                      disabled={reviewSubmitting}
                    >
                      <option value="">Choose a rating</option>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                    <label htmlFor="facility-review-comment">Comment</label>
                    <textarea
                      id="facility-review-comment"
                      name="comment"
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      maxLength={2000}
                      rows={4}
                      placeholder="Share your experience with this facility"
                      disabled={reviewSubmitting}
                    />
                    <button type="submit" disabled={reviewSubmitting || !reviewRating}>
                      {reviewSubmitting ? 'Submitting...' : 'Submit review'}
                    </button>
                  </form>
                ) : (
                  <div className="details-review-sign-in">
                    <p>Sign in to share your experience.</p>
                    <button type="button" onClick={onOpenAuth}>Sign in or register</button>
                  </div>
                )}
              </section>
              {/* Volunteer Application Section */}
              <section className="details-volunteer-section" aria-labelledby="volunteer-heading">
                <div className="details-volunteer-heading">
                  <h2 id="volunteer-heading">Volunteer at this facility</h2>
                  <span>Join our community</span>
                </div>
                <p className="details-services-note">
                  Help support individuals and families in need by lending your time and skills to this facility.
                </p>

                {volunteerSuccess && (
                  <p className="details-volunteer-success" role="status">
                    {volunteerSuccess}
                  </p>
                )}
                {volunteerError && (
                  <p className="details-volunteer-error" role="alert">
                    {volunteerError}
                  </p>
                )}

                {userVolunteerStatus && (
                  <div className="details-volunteer-current">
                    <div className="details-volunteer-badge">
                      <span>Application status:</span>
                      <strong className={`status-pill status-${userVolunteerStatus.status}`}>
                        {userVolunteerStatus.status.toUpperCase()}
                      </strong>
                    </div>
                    {userVolunteerStatus.role && (
                      <p><strong>Role:</strong> {userVolunteerStatus.role}</p>
                    )}
                    {userVolunteerStatus.availability && (
                      <p><strong>Availability:</strong> {userVolunteerStatus.availability}</p>
                    )}
                    {userVolunteerStatus.status === 'pending' && (
                      <small>Your application has been received and is awaiting administrator review.</small>
                    )}
                    {userVolunteerStatus.status === 'approved' && (
                      <small className="approved-note">You are approved as a volunteer for this facility!</small>
                    )}
                  </div>
                )}

                {user ? (
                  !userVolunteerStatus || userVolunteerStatus.status === 'rejected' ? (
                    <form className="details-volunteer-form" onSubmit={handleVolunteerApply}>
                      <h3>{userVolunteerStatus?.status === 'rejected' ? 'Re-apply to volunteer' : 'Submit Volunteer Application'}</h3>
                      <label htmlFor="volunteer-role">Preferred Role / Skills</label>
                      <input
                        type="text"
                        id="volunteer-role"
                        name="role"
                        placeholder="e.g. Food Server, Front Desk, Counseling, Tutor, General Help"
                        value={volunteerRole}
                        onChange={(e) => setVolunteerRole(e.target.value)}
                        required
                        disabled={volunteerSubmitting}
                      />

                      <label htmlFor="volunteer-availability">Availability</label>
                      <input
                        type="text"
                        id="volunteer-availability"
                        name="availability"
                        placeholder="e.g. Weekends 9AM-2PM, Mon & Wed evenings, Flexible"
                        value={volunteerAvailability}
                        onChange={(e) => setVolunteerAvailability(e.target.value)}
                        required
                        disabled={volunteerSubmitting}
                      />

                      <button type="submit" disabled={volunteerSubmitting}>
                        {volunteerSubmitting ? 'Submitting Application...' : 'Apply to Volunteer'}
                      </button>
                    </form>
                  ) : null
                ) : (
                  <div className="details-volunteer-sign-in">
                    <p>Sign in or register an account to apply as a volunteer.</p>
                    <button type="button" onClick={onOpenAuth}>Sign in to apply</button>
                  </div>
                )}
              </section>

            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default PublicFacilityDetails;
