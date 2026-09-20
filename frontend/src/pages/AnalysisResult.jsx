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
  Loader2,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function AnalysisResult({
  onNavigate,
  analysisData,
  theme,
  onToggleTheme,
}) {
  // =========================
  // DATA — analysisData ya fallback
  // =========================
  const data = analysisData || {
    id: null,
    title: "No analysis selected",
    query: "Please run a new analysis to see results.",
    analysis_type: "single",
    status: "pending",
    images: [],
    created_at: null,
    predictions: null,
  };

  // Predictions se NDVI/NDWI nikalein
  const predictions = data.predictions || {};
  const ndvi = predictions.ndvi ?? predictions.ndvi_mean;
  const ndwi = predictions.ndwi ?? predictions.ndwi_mean;
  const vegetation_pct = predictions.vegetation_pct;
  const water_pct = predictions.water_pct;
  const urban_pct = predictions.urban_pct;

  const hasPredictions =
    ndvi !== undefined || ndwi !== undefined || vegetation_pct !== undefined;

  // =========================
  // HELPERS
  // =========================
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Production backend URL
    const PROD_BACKEND = "https://satquery-backend-dh6h.onrender.com";

    // Agar already full URL hai
    if (imagePath.startsWith("http")) {
      // Agar localhost URL hai toh Render se replace karein
      if (
        imagePath.includes("localhost:8000") ||
        imagePath.includes("127.0.0.1:8000")
      ) {
        return imagePath
          .replace("http://localhost:8000", PROD_BACKEND)
          .replace("http://127.0.0.1:8000", PROD_BACKEND);
      }
      return imagePath;
    }

    // Relative path — backend URL prepend karein
    return `${PROD_BACKEND}${imagePath}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString();
  };

  const getAnalysisTypeLabel = (type) => {
    const labels = {
      single: "Single Image",
      change: "Change Detection",
      sar: "Optical + SAR",
    };
    return labels[type] || "Single Image";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
    };
    return labels[status] || "Pending";
  };

  const isCompleted = data.status === "completed";
  const isFailed = data.status === "failed";
  const hasImages = data.images && data.images.length > 0;
  const gridColumns = data.images?.length > 1 ? "1fr 1fr" : "1fr";

  // =========================
  // RENDER
  // =========================
  return (
    <div className="app-layout">
      <Sidebar
        active="analysis"
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <main className="dashboard">
        <header className="dashboard-header">
          <div>
            <span>Workspace</span>
            <b>/</b>
            <strong>Analysis Result</strong>
          </div>

          <div className="header-user">
            ☀<span>◈</span>ST
            <span>SatQuery User⌄</span>
          </div>
        </header>

        <div className="result-page">
          {/* TITLE */}
          <div className="result-title">
            <div>
              <small>ANALYSIS RESULT</small>
              <h1>Analysis Result</h1>
              <p>AI-generated insights from satellite imagery.</p>
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

          {/* QUERY SUMMARY */}
          <section className="result-query-card">
            <div className="result-query-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <small>YOUR QUERY</small>
              <h2>{data.query || data.title}</h2>

              <div className="result-meta">
                <span>
                  <Target size={13} />
                  {getAnalysisTypeLabel(data.analysis_type)}
                </span>

                {data.id && (
                  <span>
                    <ImageIcon size={13} />
                    Analysis #{data.id}
                  </span>
                )}

                <span
                  className={
                    isCompleted ? "result-completed" : "result-pending"
                  }
                >
                  {isCompleted ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <Loader2 size={13} />
                  )}
                  {getStatusLabel(data.status)}
                </span>
              </div>
            </div>
          </section>

          {/* MAIN GRID */}
          <div className="result-grid">
            {/* LEFT COLUMN */}
            <div className="result-main">
              {/* AI ANSWER */}
              <section className="result-card answer-card">
                <div className="result-card-header">
                  <div>
                    <small>01 / AI ANALYSIS</small>
                    <h2>What the models found</h2>
                  </div>

                  <div className="confidence-badge">
                    {isCompleted
                      ? "Completed"
                      : isFailed
                      ? "Failed"
                      : "Pending"}
                  </div>
                </div>

                <div className="answer-content">
                  {isCompleted && hasPredictions ? (
                    <>
                      <div className="answer-status">
                        <CheckCircle2 size={19} />
                        NDVI / NDWI Analysis Completed
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                          marginTop: "14px",
                          marginBottom: "14px",
                        }}
                      >
                        <div
                          style={{
                            padding: "12px",
                            background: "rgba(0,0,0,0.2)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <small
                            style={{
                              fontSize: "10px",
                              opacity: 0.7,
                              display: "block",
                              marginBottom: "4px",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            NDVI (Vegetation)
                          </small>
                          <div
                            style={{
                              fontSize: "26px",
                              fontWeight: "700",
                              color:
                                ndvi > 0.3
                                  ? "#22c55e"
                                  : ndvi > 0
                                  ? "#f59e0b"
                                  : "#ef4444",
                            }}
                          >
                            {ndvi?.toFixed(3) ?? "—"}
                          </div>
                        </div>

                        <div
                          style={{
                            padding: "12px",
                            background: "rgba(0,0,0,0.2)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <small
                            style={{
                              fontSize: "10px",
                              opacity: 0.7,
                              display: "block",
                              marginBottom: "4px",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            NDWI (Water)
                          </small>
                          <div
                            style={{
                              fontSize: "26px",
                              fontWeight: "700",
                              color:
                                ndwi > 0.3
                                  ? "#3b82f6"
                                  : ndwi > 0
                                  ? "#60a5fa"
                                  : "#64748b",
                            }}
                          >
                            {ndwi?.toFixed(3) ?? "—"}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          padding: "12px",
                          background: "rgba(0,0,0,0.15)",
                          borderRadius: "10px",
                          fontSize: "14px",
                          lineHeight: "2",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            paddingBottom: "4px",
                          }}
                        >
                          <span>🌿 Vegetation</span>
                          <strong style={{ color: "#22c55e" }}>
                            {vegetation_pct ?? 0}%
                          </strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            paddingBottom: "4px",
                          }}
                        >
                          <span>💧 Water Bodies</span>
                          <strong style={{ color: "#3b82f6" }}>
                            {water_pct ?? 0}%
                          </strong>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>🏙️ Urban / Bare Soil</span>
                          <strong style={{ color: "#94a3b8" }}>
                            {urban_pct ?? 0}%
                          </strong>
                        </div>
                      </div>

                      <p style={{ marginTop: "14px", opacity: 0.85 }}>
                        Analysis performed using NDVI and NDWI indices on
                        Sentinel-2 spectral bands (B03, B04, B08).
                      </p>
                    </>
                  ) : isFailed ? (
                    <>
                      <div className="answer-status" style={{ color: "#ef4444" }}>
                        <AlertCircle size={19} />
                        Analysis Failed
                      </div>
                      <p>
                        The satellite analysis for this request could not be
                        completed.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="answer-status">
                        <Loader2 size={19} className="spin" />
                        Analysis Pending
                      </div>
                      <p>
                        This analysis is currently pending. Results will
                        appear once the satellite data is processed.
                      </p>
                    </>
                  )}
                </div>
              </section>

              {/* VISUAL EVIDENCE */}
              <section className="result-card">
                <div className="result-card-header">
                  <div>
                    <small>02 / VISUAL EVIDENCE</small>
                    <h2>
                      Uploaded{" "}
                      {data.images?.length > 1 ? "images" : "image"}
                    </h2>
                  </div>
                  <span className="evidence-label">Original input</span>
                </div>

                {hasImages ? (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: gridColumns,
                        gap: "12px",
                        width: "100%",
                      }}
                    >
                      {data.images.map((img, idx) => (
                        <div
                          key={img.id || idx}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "320px",
                              overflow: "hidden",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#0a1420",
                              border: "1px solid var(--border, #1e293b)",
                            }}
                          >
                            <img
                              src={getImageUrl(img.image)}
                              alt={`Evidence ${idx + 1}`}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                width: "auto",
                                height: "auto",
                                objectFit: "contain",
                                borderRadius: "8px",
                              }}
                              onError={(e) => {
                                console.error(
                                  "Image failed to load:",
                                  e.target.src
                                );
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="evidence-legend">
                      <span>
                        <i></i>
                        Original satellite image
                        {data.images.length > 1 ? "s" : ""}
                      </span>
                      <span>{data.images.length} image(s) uploaded</span>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "320px",
                      overflow: "hidden",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#0a1420",
                    }}
                  >
                    <div className="evidence-placeholder">
                      <ImageIcon size={42} />
                      <strong>No image uploaded</strong>
                      <span>
                        This analysis was performed via Map Explorer using
                        coordinates instead of uploaded images.
                      </span>
                    </div>
                  </div>
                )}
              </section>

              {/* TECHNIQUE */}
              <section className="result-card">
                <div className="result-card-header">
                  <div>
                    <small>03 / TECHNIQUE</small>
                    <h2>Analysis Methodology</h2>
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    fontSize: "13px",
                    lineHeight: "1.8",
                    opacity: 0.9,
                  }}
                >
                  <p>
                    <strong>Data Source:</strong> Copernicus Sentinel-2 L2A
                    via CDSE STAC API
                  </p>
                  <p>
                    <strong>Indices Used:</strong> NDVI = (B08 - B04) / (B08
                    + B04) | NDWI = (B03 - B08) / (B03 + B08)
                  </p>
                  <p>
                    <strong>Thresholds:</strong> Vegetation: NDVI &gt; 0.3 |
                    Water: NDWI &gt; 0.3 | Urban: NDVI 0.0 – 0.2
                  </p>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <aside className="result-side">
              <div className="result-card">
                <div className="side-card-header">
                  <strong>Analysis Details</strong>
                </div>

                <Detail
                  icon={<Brain size={15} />}
                  label="Analysis Type"
                  value={getAnalysisTypeLabel(data.analysis_type)}
                />

                <Detail
                  icon={<Sparkles size={15} />}
                  label="Status"
                  value={getStatusLabel(data.status)}
                />

                <Detail
                  icon={<MapPin size={15} />}
                  label="Analysis ID"
                  value={data.id ? `#${data.id}` : "—"}
                />

                <Detail
                  icon={<ImageIcon size={15} />}
                  label="Images"
                  value={
                    data.images?.length > 0
                      ? `${data.images.length} uploaded`
                      : "Map Query"
                  }
                />

                <Detail
                  icon={<FileText size={15} />}
                  label="Created"
                  value={formatDate(data.created_at)}
                />
              </div>

              <div className="result-card">
                <div className="side-card-header">
                  <strong>Execution Trace</strong>
                  <span className="ready-badge">
                    ● {getStatusLabel(data.status)}
                  </span>
                </div>

                <ResultStep number="01" title="Request received" done={true} />
                <ResultStep
                  number="02"
                  title="Satellite data fetch"
                  done={isCompleted || isFailed}
                />
                <ResultStep
                  number="03"
                  title="NDVI/NDWI calculation"
                  done={isCompleted}
                />
                <ResultStep
                  number="04"
                  title="Evidence generation"
                  done={isCompleted}
                />
              </div>

              <div className="report-card">
                <FileText size={19} />
                <div>
                  <strong>Analysis report</strong>
                  <span>
                    {isCompleted
                      ? "Export findings available soon"
                      : "Report will be available after completion"}
                  </span>
                </div>
                <button type="button" disabled={!isCompleted}>
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

function Detail({ icon, label, value }) {
  return (
    <div className="detail-row">
      <div className="detail-icon">{icon}</div>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function ResultStep({ number, title, done }) {
  return (
    <div className="result-step">
      <div className="result-step-number">
        {done ? (
          <CheckCircle2 size={13} />
        ) : (
          <Loader2 size={13} style={{ opacity: 0.4 }} />
        )}
      </div>
      <span>{title}</span>
      <small>{number}</small>
    </div>
  );
}

export default AnalysisResult;