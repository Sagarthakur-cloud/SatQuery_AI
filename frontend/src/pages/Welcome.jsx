import {
  ArrowRight,
  Sparkles,
  Satellite,
  Radio,
  ScanSearch
} from "lucide-react";

import Globe from "../components/Globe";

function Welcome({ onStart, onDemo }) {
  return (
    <div className="welcome-page">

      {/* NAVBAR */}
      <header className="welcome-nav">

        <div className="brand">
          <div className="wc-brand-icon">
            <img
              src="/logo.png"
              alt="SatQuery AI"
              className="sidebar-logo-image"
            />
          </div>

          <div>
            <div className="brand-name">
              SatQuery <span>AI</span>
            </div>

            <div className="brand-subtitle">
              EARTH INTELLIGENCE
            </div>
          </div>
        </div>



        <button
          className="nav-button"
          onClick={onStart}
        >
          Open Workspace
          <ArrowRight size={16} />
        </button>

      </header>


      {/* HERO */}
      <main className="hero">

        <section className="hero-content">

          <div className="hero-badge">
            <span className="status-dot"></span>
            MULTIMODAL REMOTE SENSING
          </div>

          <h1>
            Ask questions.
            <br />
            <span>Understand Earth.</span>
          </h1>

          <p>
            SatQuery AI turns natural-language questions into
            evidence-backed satellite image analysis across
            optical, SAR and bi-temporal imagery.
          </p>

          <div className="hero-actions">

            <button
              className="primary-button"
              onClick={onStart}
            >
              Start analyzing
              <ArrowRight size={17} />
            </button>

            <button
  className="secondary-button"
  onClick={onDemo}
>
  Explore demo
</button>

          </div>

          <div className="hero-features">
            <span>✓ Natural language</span>
            <span>✓ AI model routing</span>
            <span>✓ Spatial evidence</span>
          </div>

        </section>


        {/* GLOBE */}
        <section className="hero-globe">

          <div className="earth-data-card">
            <div>LIVE EARTH DATA</div>

            <strong>
              <span className="green-dot"></span>
              SYSTEM NOMINAL
            </strong>

            <small>
              12,450+ satellites tracked
            </small>
          </div>

          <Globe />

          <div className="coverage-card">
            <small>GLOBAL COVERAGE</small>
            <strong>100%</strong>
            <span>Optical + SAR</span>
          </div>

          <div className="globe-hint">
            DRAG TO ROTATE · SCROLL TO ZOOM
          </div>

        </section>

      </main>




    </div>
  );
}

export default Welcome;