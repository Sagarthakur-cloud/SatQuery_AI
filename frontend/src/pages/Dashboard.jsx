import {
  Plus,
  Search,
  Satellite,
  ScanSearch,
  Radio,
  ArrowRight,
  MoreVertical,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Dashboard({
  onNewAnalysis,
  onNavigate,
  theme,
  onToggleTheme,
}) {
  return (
    <div className="app-layout">

      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar
        active="dashboard"
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* =========================
          MAIN DASHBOARD
      ========================= */}

      <main className="dashboard">

        {/* TOP BAR
        <header className="dashboard-header">

          <div>
            <span>Workspace</span>
            <b>/</b>
            <strong>Dashboard</strong>
          </div>

          <div className="header-user">
            ☀
            <span>◈</span>
            ST
            <span>SatQuery User⌄</span>
          </div>

        </header>
        */}

        <div className="dashboard-content">

          {/* =========================
              GREETING
          ========================= */}

          <section className="dashboard-title">

            <div>
              <small>OVERVIEW</small>

              <h1>
                Good evening, researcher.
              </h1>

              <p>
                Turn satellite imagery into explainable intelligence.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={onNewAnalysis}
            >
              <Plus size={17} />
              New Analysis
            </button>

          </section>


          {/* =========================
              AI SEARCH CARD
          ========================= */}

          <section className="ai-search-card">

            <div className="ai-search-content">

              <small>
                AI ANALYSIS ENGINE ONLINE
              </small>

              <h2>
                Ask a question about <span>Earth.</span>
              </h2>

              <p>
                Upload imagery, ask in natural language,
                and let SatQuery route the right remote-sensing
                analysis automatically.
              </p>

              <div className="question-box">

                <Search size={18} />

                <input
                  placeholder="e.g. Identify all water bodies in this image..."
                />

                <button onClick={onNewAnalysis}>
                  Ask AI →
                </button>

              </div>

              <div className="suggestions">

                <span>Try:</span>

                <button>
                  Find water bodies
                </button>

                <button>
                  Identify buildings
                </button>

                <button>
                  Describe this image
                </button>

                <button>
                  Detect changes
                </button>

              </div>

            </div>

            <div className="ai-orbit">
              <div className="ai-core"></div>
            </div>

          </section>


          {/* =========================
              STATS
          ========================= */}

          <section className="stats-grid">

            <Stat
              icon={<ScanSearch size={16} />}
              title="TOTAL ANALYSES"
              number="24"
              change="↑ 12.0%"
              subtitle="vs. last month"
            />

            <Stat
              icon={<Satellite size={16} />}
              title="IMAGES ANALYZED"
              number="56"
              change="↑ 18"
              subtitle="this week"
            />

            <Stat
              icon={<ScanSearch size={16} />}
              title="CHANGE DETECTIONS"
              number="11"
              change="8 significant"
              subtitle="changes detected"
            />

            <Stat
              icon={<Radio size={16} />}
              title="REPORTS GENERATED"
              number="18"
              change="↑ 6"
              subtitle="this month"
            />

          </section>


          {/* =========================
              START ANALYSIS
          ========================= */}

          <section className="analysis-section">

            <div className="section-heading">

              <div>
                <h2>
                  Start an analysis
                </h2>

                <p>
                  Choose the workflow that matches your imagery.
                </p>
              </div>

              <button className="outline-button">
                ▶ Try live demo
              </button>

            </div>


            <div className="analysis-cards">

              <AnalysisCard
                icon={<Satellite />}
                title="Single Image"
                description="VQA, captioning and object / region grounding."
                tags={[
                  "VQA",
                  "Grounding",
                  "Captioning",
                ]}
                onClick={onNewAnalysis}
              />

              <AnalysisCard
                icon={<ScanSearch />}
                title="Change Detection"
                recommended
                description="Compare two acquisition dates and explain what changed."
                tags={[
                  "Bi-temporal",
                  "Change map",
                  "VQA",
                ]}
                onClick={onNewAnalysis}
              />

              <AnalysisCard
                icon={<Radio />}
                title="Optical + SAR"
                description="Fuse optical and radar imagery for complementary evidence."
                tags={[
                  "Fusion",
                  "SAR",
                  "Multimodal",
                ]}
                onClick={onNewAnalysis}
              />

            </div>

          </section>


          {/* =========================
              RECENT ANALYSES
          ========================= */}

          <section className="recent-section">

            <div className="section-heading">

              <div>
                <h2>
                  Recent analyses
                </h2>

                <p>
                  Your latest remote-sensing investigations.
                </p>
              </div>

              <button className="view-all">
                View all →
              </button>

            </div>


            <div className="recent-table">

              <div className="table-header">

                <span>ANALYSIS</span>
                <span>TYPE</span>
                <span>INPUT</span>
                <span>DATE</span>
                <span>STATUS</span>
                <span></span>

              </div>


              <Recent
                name="Water Body Detection"
                type="Object Grounding"
                input="Sentinel-2"
                date="Today, 10:42"
              />

              <Recent
                name="Urban Expansion"
                type="Change Detection"
                input="Sentinel-2"
                date="Yesterday, 16:20"
              />

              <Recent
                name="Optical + SAR Built-up Analysis"
                type="Multimodal"
                input="Sentinel-1 + 2"
                date="Yesterday, 12:05"
              />

              <Recent
                name="Agricultural Land Query"
                type="Visual Q&A"
                input="Sentinel-2"
                date="Aug 28, 2026"
              />

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   STAT COMPONENT
===================================================== */

function Stat({
  icon,
  title,
  number,
  change,
  subtitle,
}) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <small>
        {title}
      </small>

      <strong>
        {number}
      </strong>

      <span className="stat-change">
        {change}
      </span>

      <span className="stat-subtitle">
        {subtitle}
      </span>

      <MoreVertical
        size={16}
        className="stat-more"
      />

    </div>
  );
}


/* =====================================================
   ANALYSIS CARD
===================================================== */

function AnalysisCard({
  icon,
  title,
  description,
  tags,
  recommended,
  onClick,
}) {
  return (
    <button
      className="analysis-card"
      onClick={onClick}
    >

      <div className="analysis-icon">
        {icon}
      </div>

      {recommended && (
        <span className="recommended">
          RECOMMENDED
        </span>
      )}

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

      <div className="tags">

        {tags.map((tag) => (
          <span key={tag}>
            {tag}
          </span>
        ))}

      </div>

      <ArrowRight
        className="card-arrow"
        size={17}
      />

    </button>
  );
}


/* =====================================================
   RECENT ANALYSIS
===================================================== */

function Recent({
  name,
  type,
  input,
  date,
}) {
  return (
    <div className="table-row">

      <div className="analysis-name">

        <div className="mini-icon">
          <Satellite size={14} />
        </div>

        <div>

          <strong>
            {name}
          </strong>

          <small>
            Confidence 94.2%
          </small>

        </div>

      </div>

      <span>
        {type}
      </span>

      <span>
        {input}
      </span>

      <span>
        {date}
      </span>

      <span className="completed">
        ● Completed
      </span>

      <MoreVertical size={16} />

    </div>
  );
}


export default Dashboard;