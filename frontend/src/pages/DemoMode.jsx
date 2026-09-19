import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  FileText,
  Map,
  Play,
  RotateCcw,
  Satellite,
  Search,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

function DemoMode({ onExit }) {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const steps = [
    {
      id: "dashboard",
      label: "Workspace",
      title: "SatQuery AI Workspace",
      description:
        "A unified workspace for natural-language satellite intelligence.",
      icon: Satellite,
    },
    {
      id: "query",
      label: "Query",
      title: "Ask Earth in Natural Language",
      description:
        "Users can ask satellite intelligence questions without writing complex geospatial queries.",
      icon: Search,
    },
    {
      id: "pipeline",
      label: "AI Pipeline",
      title: "AI Execution Pipeline",
      description:
        "SatQuery routes the request through image ingestion, preprocessing, detection and spatial reasoning.",
      icon: Zap,
    },
    {
      id: "result",
      label: "Analysis",
      title: "Evidence-backed Analysis",
      description:
        "The system presents detected objects, confidence information and visual evidence.",
      icon: Sparkles,
    },
    {
      id: "map",
      label: "Map",
      title: "Explore Spatial Evidence",
      description:
        "Results can be explored geographically through the interactive map workspace.",
      icon: Map,
    },
    {
      id: "report",
      label: "Report",
      title: "Generate Analysis Report",
      description:
        "The complete analysis can be converted into a structured report for further use.",
      icon: FileText,
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setStep((current) => {
        if (current >= steps.length - 1) {
          setAutoPlay(false);
          return current;
        }

        return current + 1;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [autoPlay, steps.length]);

  const nextStep = () => {
    setStep((current) =>
      Math.min(current + 1, steps.length - 1)
    );
  };

  const previousStep = () => {
    setStep((current) =>
      Math.max(current - 1, 0)
    );
  };

  const restart = () => {
    setStep(0);
    setAutoPlay(false);
  };

  const current = steps[step];
  const CurrentIcon = current.icon;

  return (
    <div className="demo-page">

      {/* BACKGROUND */}
      <div className="demo-grid"></div>
      <div className="demo-glow demo-glow-one"></div>
      <div className="demo-glow demo-glow-two"></div>

      {/* HEADER */}
      <header className="demo-header">

        <div className="demo-brand">
          <div className="demo-brand-icon">
            <img
              src="/logo.png"
              alt="SatQuery AI"
            />
          </div>

          <div>
            <strong>
              SatQuery <span>AI</span>
            </strong>

            <small>
              SIH DEMO MODE
            </small>
          </div>
        </div>

        <div className="demo-header-center">
          <span className="demo-live-dot"></span>
          LIVE PROJECT WALKTHROUGH
        </div>

        <button
          type="button"
          className="demo-exit"
          onClick={onExit}
        >
          Exit Demo
          <X size={16} />
        </button>

      </header>

      {/* MAIN */}
      <main className="demo-main">

        {/* TITLE */}
        <div className="demo-title-section">

          <div className="demo-eyebrow">
            <Sparkles size={14} />
            SMART INDIA HACKATHON · PROJECT DEMONSTRATION
          </div>

          <h1>
            From a question
            <span> to satellite intelligence.</span>
          </h1>

          <p>
            Follow the complete SatQuery AI workflow from
            natural-language query to evidence-backed
            geospatial results.
          </p>

        </div>

        {/* STEPPER */}
        <div className="demo-stepper">

          {steps.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`demo-step ${
                  index === step ? "active" : ""
                } ${
                  index < step ? "completed" : ""
                }`}
                onClick={() => setStep(index)}
              >
                <div className="demo-step-icon">
                  {index < step ? (
                    <Check size={15} />
                  ) : (
                    <Icon size={15} />
                  )}
                </div>

                <span>
                  {item.label}
                </span>
              </div>
            );
          })}

        </div>

        {/* CONTENT */}
        <section className="demo-workspace">

          {/* LEFT VISUAL */}
          <div className="demo-visual">

            <div className="demo-visual-header">
              <div>
                <span>
                  STEP {String(step + 1).padStart(2, "0")}
                </span>

                <strong>
                  {current.label}
                </strong>
              </div>

              <div className="demo-status">
                <span></span>
                SYSTEM NOMINAL
              </div>
            </div>

            <div className="demo-screen">

              {step === 0 && (
                <DashboardPreview />
              )}

              {step === 1 && (
                <QueryPreview />
              )}

              {step === 2 && (
                <PipelinePreview />
              )}

              {step === 3 && (
                <ResultPreview />
              )}

              {step === 4 && (
                <MapPreview />
              )}

              {step === 5 && (
                <ReportPreview />
              )}

            </div>

          </div>

          {/* RIGHT INFO */}
          <aside className="demo-info">

            <div className="demo-info-icon">
              <CurrentIcon size={22} />
            </div>

            <div className="demo-info-step">
              STEP {String(step + 1).padStart(2, "0")} /{" "}
              {String(steps.length).padStart(2, "0")}
            </div>

            <h2>
              {current.title}
            </h2>

            <p>
              {current.description}
            </p>

            <div className="demo-feature-list">

              <DemoFeature
                text={
                  step === 0
                    ? "Unified satellite intelligence workspace"
                    : step === 1
                    ? "Natural language geospatial query"
                    : step === 2
                    ? "Multi-stage AI execution pipeline"
                    : step === 3
                    ? "Evidence-backed detection results"
                    : step === 4
                    ? "Interactive spatial exploration"
                    : "Structured analysis reporting"
                }
              />

              <DemoFeature
                text={
                  step < 2
                    ? "Designed for non-GIS users"
                    : step < 4
                    ? "Transparent AI processing"
                    : "Decision-ready outputs"
                }
              />

            </div>

          </aside>

        </section>

        {/* CONTROLS */}
        <div className="demo-controls">

          <button
            type="button"
            className="demo-control secondary"
            onClick={previousStep}
            disabled={step === 0}
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          <button
            type="button"
            className={`demo-control autoplay ${
              autoPlay ? "playing" : ""
            }`}
            onClick={() => setAutoPlay((value) => !value)}
          >
            {autoPlay ? (
              <>
                <span className="demo-pulse"></span>
                Auto Playing
              </>
            ) : (
              <>
                <Play size={15} />
                Auto Play
              </>
            )}
          </button>

          {step === steps.length - 1 ? (
            <button
              type="button"
              className="demo-control primary"
              onClick={restart}
            >
              <RotateCcw size={16} />
              Restart Demo
            </button>
          ) : (
            <button
              type="button"
              className="demo-control primary"
              onClick={nextStep}
            >
              Next Step
              <ArrowRight size={16} />
            </button>
          )}

        </div>

      </main>

      <footer className="demo-footer">
        <span>
          SATQUERY AI
        </span>

        <span className="demo-footer-dot"></span>

        <span>
          EARTH OBSERVATION INTELLIGENCE
        </span>

        <span className="demo-footer-spacer"></span>

        <span>
          SIH PRESENTATION MODE
        </span>
      </footer>

    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
   ========================================================= */

function DemoFeature({ text }) {
  return (
    <div className="demo-feature">
      <Check size={14} />
      <span>{text}</span>
    </div>
  );
}

/* =========================================================
   DASHBOARD PREVIEW
   ========================================================= */

function DashboardPreview() {
  return (
    <div className="preview-dashboard">

      <div className="preview-sidebar">
        <div className="preview-logo">
          <Satellite size={15} />
        </div>

        <span className="active"></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="preview-content">

        <div className="preview-topbar">
          <div>
            <small>WORKSPACE</small>
            <strong>Dashboard</strong>
          </div>

          <div className="preview-user">
            ST
          </div>
        </div>

        <div className="preview-greeting">
          <small>EARTH INTELLIGENCE WORKSPACE</small>
          <h3>
            Analyze Earth with AI.
          </h3>
        </div>

        <div className="preview-stats">

          <div>
            <small>ANALYSES</small>
            <strong>24</strong>
          </div>

          <div>
            <small>IMAGES</small>
            <strong>186</strong>
          </div>

          <div>
            <small>ACCURACY</small>
            <strong>94.7%</strong>
          </div>

        </div>

        <div className="preview-analysis-card">
          <div className="preview-card-icon">
            <Sparkles size={15} />
          </div>

          <div>
            <small>AI ANALYSIS</small>
            <strong>
              Start a new satellite analysis
            </strong>
          </div>

          <ArrowRight size={15} />
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   QUERY PREVIEW
   ========================================================= */

function QueryPreview() {
  return (
    <div className="preview-query">

      <div className="preview-query-header">
        <small>NEW ANALYSIS</small>

        <div className="preview-tabs">
          <span className="active">
            Single Image
          </span>
          <span>
            Change Detection
          </span>
          <span>
            Optical + SAR
          </span>
        </div>
      </div>

      <div className="preview-query-body">

        <div className="preview-image-placeholder">
          <Satellite size={32} />
          <span>
            SATELLITE IMAGE
          </span>
          <small>
            SAMPLE DATASET · AOI 23.68°N 86.95°E
          </small>
        </div>

        <div className="preview-query-box">

          <div className="preview-query-label">
            NATURAL LANGUAGE QUERY
          </div>

          <div className="preview-query-text">
            Identify newly constructed buildings
            and changes in this area.
          </div>

          <button>
            <Zap size={13} />
            Run Analysis
          </button>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   PIPELINE PREVIEW
   ========================================================= */

function PipelinePreview() {
  const items = [
    "Image ingestion",
    "Image preprocessing",
    "Geospatial analysis",
    "Object detection",
    "Change detection",
    "Natural language reasoning",
  ];

  return (
    <div className="preview-pipeline">

      <div className="preview-pipeline-header">
        <div>
          <small>AI EXECUTION PIPELINE</small>
          <strong>
            Processing satellite intelligence
          </strong>
        </div>

        <span className="processing">
          PROCESSING
        </span>
      </div>

      <div className="pipeline-list">

        {items.map((item, index) => (
          <div
            key={item}
            className="pipeline-item"
          >
            <div className="pipeline-number">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="pipeline-line"></div>

            <div className="pipeline-check">
              <Check size={12} />
            </div>

            <span>
              {item}
            </span>

            <small>
              COMPLETE
            </small>
          </div>
        ))}

      </div>

    </div>
  );
}

/* =========================================================
   RESULT PREVIEW
   ========================================================= */

function ResultPreview() {
  return (
    <div className="preview-result">

      <div className="result-preview-header">
        <div>
          <small>ANALYSIS RESULT</small>
          <strong>
            Detected changes
          </strong>
        </div>

        <span>
          94.7% CONFIDENCE
        </span>
      </div>

      <div className="result-preview-grid">

        <div className="result-image">
          <div className="result-map-grid"></div>

          <div className="result-detection detection-one">
            <span>BUILDING</span>
          </div>

          <div className="result-detection detection-two">
            <span>BUILDING</span>
          </div>

          <div className="result-detection detection-three">
            <span>ROAD</span>
          </div>
        </div>

        <div className="result-details">

          <div>
            <small>BUILDINGS</small>
            <strong>18</strong>
          </div>

          <div>
            <small>ROAD CHANGE</small>
            <strong>2.4 km</strong>
          </div>

          <div>
            <small>VEGETATION</small>
            <strong>-8.2%</strong>
          </div>

          <div>
            <small>AREA ANALYZED</small>
            <strong>14.6 km²</strong>
          </div>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   MAP PREVIEW
   ========================================================= */

function MapPreview() {
  return (
    <div className="preview-map">

      <div className="map-preview-grid"></div>

      <div className="map-preview-road road-one"></div>
      <div className="map-preview-road road-two"></div>
      <div className="map-preview-road road-three"></div>

      <div className="map-marker marker-one">
        <span></span>
        <small>
          NEW BUILDING
        </small>
      </div>

      <div className="map-marker marker-two">
        <span></span>
        <small>
          CHANGE AREA
        </small>
      </div>

      <div className="map-preview-label">
        <Map size={13} />
        SELECTED AREA
      </div>

      <div className="map-coordinates">
        23.6851° N
        <br />
        86.9523° E
      </div>

    </div>
  );
}

/* =========================================================
   REPORT PREVIEW
   ========================================================= */

function ReportPreview() {
  return (
    <div className="preview-report">

      <div className="report-preview-header">

        <div className="report-brand">
          <div>
            <Satellite size={16} />
          </div>

          <span>
            SATQUERY AI
          </span>
        </div>

        <small>
          ANALYSIS REPORT
        </small>

      </div>

      <div className="report-title">
        <small>
          EARTH OBSERVATION ANALYSIS
        </small>

        <h3>
          Infrastructure Change Assessment
        </h3>

        <p>
          AI-generated evidence summary for the
          selected area of interest.
        </p>
      </div>

      <div className="report-metrics">

        <div>
          <strong>18</strong>
          <span>Detected Buildings</span>
        </div>

        <div>
          <strong>94.7%</strong>
          <span>Confidence</span>
        </div>

        <div>
          <strong>14.6 km²</strong>
          <span>Area Analyzed</span>
        </div>

      </div>

      <div className="report-status">
        <Check size={14} />
        ANALYSIS COMPLETE · REPORT READY
      </div>

    </div>
  );
}

export default DemoMode;