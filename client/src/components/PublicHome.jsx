import './PublicHome.css';

const PublicHome = ({ onFindHelp, onAdmin }) => (
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
    </main>
  </div>
);

export default PublicHome;
