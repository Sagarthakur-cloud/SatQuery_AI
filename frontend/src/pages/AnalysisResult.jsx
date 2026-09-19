import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Image as ImageIcon,
  Sparkles,
  Target,
  Brain,
  MapPin,
  FileText,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function AnalysisResult({
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
        active="analysis"
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="dashboard">

        {/* HEADER */}
        <header className="dashboard-header">

          <div>
            <span>Workspace</span>
            <b>/</b>
            <strong>Analysis Result</strong>
          </div>

          <div className="header-user">
            ☀
            <span>◈</span>
            ST
            <span>SatQuery User⌄</span>
          </div>

        </header>


        <div className="result-page">

          {/* =========================
              TITLE
          ========================= */}

          <div className="result-title">

            <div>

              <small>
                ANALYSIS COMPLETE
              </small>

              <h1>
                Analysis Result
              </h1>

              <p>
                AI-generated insights from your satellite imagery.
              </p>

            </div>


            <div className="result-actions">

              <button
                className="outline-button"
                onClick={() => onNavigate("dashboard")}
              >
                <ArrowLeft size={15} />
                Dashboard
              </button>

              <button
                className="primary-button"
                onClick={() => onNavigate("analysis")}
              >
                New Analysis
              </button>

            </div>

          </div>


          {/* =========================
              QUERY SUMMARY
          ========================= */}

          <section className="result-query-card">

            <div className="result-query-icon">
              <Sparkles size={20} />
            </div>

            <div>

              <small>
                YOUR QUERY
              </small>

              <h2>
                Identify all water bodies in this image
              </h2>

              <div className="result-meta">

                <span>
                  <Target size={13} />
                  Single Image
                </span>

                <span>
                  <ImageIcon size={13} />
                  Sentinel-2
                </span>

                <span className="result-completed">
                  <CheckCircle2 size={13} />
                  Completed
                </span>

              </div>

            </div>

          </section>


          {/* =========================
              MAIN RESULT GRID
          ========================= */}

          <div className="result-grid">

            {/* =====================
                LEFT COLUMN
            ===================== */}

            <div className="result-main">

              {/* AI ANSWER */}

              <section className="result-card answer-card">

                <div className="result-card-header">

                  <div>

                    <small>
                      01 / AI ANSWER
                    </small>

                    <h2>
                      What the model found
                    </h2>

                  </div>

                  <div className="confidence-badge">
                    94.2% confidence
                  </div>

                </div>


                <div className="answer-content">

                  <div className="answer-status">
                    <CheckCircle2 size={19} />
                    Analysis successfully completed
                  </div>

                  <p>
                    The image contains several visible water bodies,
                    including a large central water feature and
                    multiple smaller water-covered regions.
                  </p>

                  <p>
                    The detected water regions appear distinct from
                    the surrounding built-up and vegetated areas
                    based on their visual characteristics.
                  </p>

                </div>

              </section>


              {/* VISUAL EVIDENCE */}

              <section className="result-card">

                <div className="result-card-header">

                  <div>

                    <small>
                      02 / VISUAL EVIDENCE
                    </small>

                    <h2>
                      Image evidence
                    </h2>

                  </div>

                  <span className="evidence-label">
                    Spatial grounding
                  </span>

                </div>


                <div className="evidence-image">

                  <div className="evidence-placeholder">

                    <ImageIcon size={42} />

                    <strong>
                      Satellite imagery
                    </strong>

                    <span>
                      Visual evidence will appear here
                    </span>

                  </div>


                  <div className="evidence-marker marker-one">
                    01
                  </div>

                  <div className="evidence-marker marker-two">
                    02
                  </div>

                  <div className="evidence-marker marker-three">
                    03
                  </div>

                </div>


                <div className="evidence-legend">

                  <span>
                    <i></i>
                    Detected water region
                  </span>

                  <span>
                    3 regions identified
                  </span>

                </div>

              </section>


              {/* DETECTIONS */}

              <section className="result-card">

                <div className="result-card-header">

                  <div>

                    <small>
                      03 / DETECTIONS
                    </small>

                    <h2>
                      Detected regions
                    </h2>

                  </div>

                </div>


                <div className="detection-list">

                  <Detection
                    number="01"
                    title="Primary water body"
                    confidence="97.1%"
                    location="Central region"
                  />

                  <Detection
                    number="02"
                    title="Secondary water body"
                    confidence="93.6%"
                    location="North-east region"
                  />

                  <Detection
                    number="03"
                    title="Small water region"
                    confidence="91.8%"
                    location="South-west region"
                  />

                </div>

              </section>

            </div>


            {/* =====================
                RIGHT COLUMN
            ===================== */}

            <aside className="result-side">

              {/* ANALYSIS DETAILS */}

              <div className="result-card">

                <div className="side-card-header">
                  <strong>
                    Analysis Details
                  </strong>
                </div>


                <Detail
                  icon={<Brain size={15} />}
                  label="Task"
                  value="Visual Question Answering"
                />

                <Detail
                  icon={<Sparkles size={15} />}
                  label="Model"
                  value="SatQuery Vision"
                />

                <Detail
                  icon={<MapPin size={15} />}
                  label="Input"
                  value="Sentinel-2 imagery"
                />

                <Detail
                  icon={<Target size={15} />}
                  label="Objects"
                  value="3 regions"
                />

              </div>


              {/* EXECUTION TRACE */}

              <div className="result-card">

                <div className="side-card-header">

                  <strong>
                    Execution Trace
                  </strong>

                  <span className="ready-badge">
                    ● Complete
                  </span>

                </div>


                <ResultStep
                  number="01"
                  title="Task classification"
                />

                <ResultStep
                  number="02"
                  title="Model routing"
                />

                <ResultStep
                  number="03"
                  title="Spatial reasoning"
                />

                <ResultStep
                  number="04"
                  title="Evidence generation"
                />

              </div>


              {/* REPORT */}

              <div className="report-card">

                <FileText size={19} />

                <div>

                  <strong>
                    Analysis report
                  </strong>

                  <span>
                    Export findings and evidence.
                  </span>

                </div>

                <button type="button">
                  <Download size={15} />
                </button>

              </div>

            </aside>

          </div>

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   DETECTION
===================================================== */

function Detection({
  number,
  title,
  confidence,
  location,
}) {
  return (
    <div className="detection-row">

      <div className="detection-number">
        {number}
      </div>

      <div>

        <strong>
          {title}
        </strong>

        <span>
          <MapPin size={12} />
          {location}
        </span>

      </div>

      <small>
        {confidence}
      </small>

    </div>
  );
}


/* =====================================================
   DETAIL
===================================================== */

function Detail({
  icon,
  label,
  value,
}) {
  return (
    <div className="detail-row">

      <div className="detail-icon">
        {icon}
      </div>

      <div>

        <small>
          {label}
        </small>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


/* =====================================================
   RESULT STEP
===================================================== */

function ResultStep({
  number,
  title,
}) {
  return (
    <div className="result-step">

      <div className="result-step-number">
        <CheckCircle2 size={13} />
      </div>

      <span>
        {title}
      </span>

      <small>
        {number}
      </small>

    </div>
  );
}


export default AnalysisResult;