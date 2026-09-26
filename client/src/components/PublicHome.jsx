import './PublicHome.css';

const PublicHome = ({ onFindHelp, onAdmin, onOpenAuth }) => (
  <div className="public-shell public-home">
    <header className="public-header">
      <button type="button" className="public-brand" onClick={onFindHelp}>
        <span className="public-brand-mark">S</span>
        <span>ShelterX</span>
      </button>
      <nav className="public-nav" aria-label="Public navigation">
        <button type="button" className="public-nav-link" onClick={onFindHelp}>
          Find Help
        </button>
        <button type="button" className="public-nav-link" onClick={onOpenAuth}>
          Login / Register
        </button>
        <button type="button" className="public-nav-link public-admin-link" onClick={onAdmin}>
          Admin Dashboard
        </button>
      </nav>
    </header>

    <main>
      <section className="public-hero">
        <div className="public-hero-inner">
          <div className="public-hero-copy">
            <p className="public-eyebrow">Support is closer than you think</p>
            <h1>Find a safe place and the support you need.</h1>
            <p className="public-hero-description">
              ShelterX helps people discover shelters, food banks, clinics, and community support facilities in one clear place.
            </p>
            <button type="button" className="public-primary-button" onClick={onFindHelp}>
              Find Help
              <span aria-hidden="true">-&gt;</span>
            </button>
          </div>
          <div className="public-hero-art" aria-hidden="true">
            <div className="public-sun" />
            <div className="public-horizon" />
            <div className="public-signal-card">
              <span className="public-signal-dot" />
              <span>Support locations, all in one place</span>
            </div>
          </div>
        </div>
      </section>

      <section className="public-home-intro">
        <p className="public-eyebrow">A simpler first step</p>
        <h2>Start with the help that is available today.</h2>
        <p>
          Browse verified facility records, check available capacity, and find contact information for support in your area.
        </p>
      </section>

      <section className="public-support-section">
        <div className="public-section-heading">
          <div>
            <p className="public-eyebrow">Find the right kind of support</p>
            <h2>One place for essential help.</h2>
          </div>
          <p>Explore the support network by the kind of help you need most.</p>
        </div>
        <div className="public-support-grid">
          <button type="button" className="public-support-card" onClick={onFindHelp}>
            <span className="public-support-number">01</span>
            <span className="public-support-icon">⌂</span>
            <strong>Safe shelter</strong>
            <span>Find places offering space and overnight support.</span>
          </button>
          <button type="button" className="public-support-card" onClick={onFindHelp}>
            <span className="public-support-number">02</span>
            <span className="public-support-icon">+</span>
            <strong>Food assistance</strong>
            <span>Locate food banks and community kitchens nearby.</span>
          </button>
          <button type="button" className="public-support-card" onClick={onFindHelp}>
            <span className="public-support-number">03</span>
            <span className="public-support-icon">✚</span>
            <strong>Health support</strong>
            <span>Browse clinics and facilities with care services.</span>
          </button>
          <button type="button" className="public-support-card" onClick={onFindHelp}>
            <span className="public-support-number">04</span>
            <span className="public-support-icon">◌</span>
            <strong>Community care</strong>
            <span>Connect with welcoming local support centers.</span>
          </button>
        </div>
      </section>

      <section className="public-process-section">
        <div className="public-process-copy">
          <p className="public-eyebrow">How ShelterX works</p>
          <h2>Clear information when the next step matters.</h2>
          <p>
            We keep the journey simple so you can spend less time searching and more time connecting with support.
          </p>
          <button type="button" className="public-outline-button" onClick={onFindHelp}>
            Browse facilities <span aria-hidden="true">-&gt;</span>
          </button>
        </div>
        <div className="public-process-list">
          <div className="public-process-item">
            <span>01</span>
            <div>
              <h3>Choose what you need</h3>
              <p>Start with a facility category or search for a location by name, city, or address.</p>
            </div>
          </div>
          <div className="public-process-item">
            <span>02</span>
            <div>
              <h3>Compare available options</h3>
              <p>Review capacity, active status, contact details, and services listed for each place.</p>
            </div>
          </div>
          <div className="public-process-item">
            <span>03</span>
            <div>
              <h3>Take the next step</h3>
              <p>Use the available contact information to reach the facility directly.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="public-confidence-section">
        <div>
          <p className="public-eyebrow">Built for clarity</p>
          <h2>See the information that helps you decide.</h2>
        </div>
        <div className="public-confidence-points">
          <div><strong>Capacity</strong><span>Understand available spaces at a glance.</span></div>
          <div><strong>Contact</strong><span>Reach facilities using the details they provide.</span></div>
          <div><strong>Services</strong><span>See what kinds of support each location offers.</span></div>
        </div>
      </section>

      <section className="public-home-cta">
        <p className="public-eyebrow">Your next step starts here</p>
        <h2>Let’s find a place that can help.</h2>
        <p>Browse the current ShelterX facility directory.</p>
        <button type="button" className="public-primary-button" onClick={onFindHelp}>
          Find Help <span aria-hidden="true">-&gt;</span>
        </button>
      </section>
    </main>
  </div>
);

export default PublicHome;
