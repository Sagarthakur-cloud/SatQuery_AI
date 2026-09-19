import { useState } from "react";

import {
  Upload,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function NewAnalysis({
  onNavigate,
  theme,
  onToggleTheme,
}) {
  const [type, setType] = useState("single");

  const [images, setImages] = useState([]);

  const [query, setQuery] = useState("");

  // =========================
  // HANDLE FILE UPLOAD
  // =========================

  const handleFiles = (files) => {
    const selected = Array.from(files);

    setImages(selected);
  };

  // =========================
  // RUN ANALYSIS
  // =========================

  const handleRun = () => {
    if (images.length === 0) {
      alert("Please upload image first.");
      return;
    }

    if (!query.trim()) {
      alert("Please enter your question.");
      return;
    }

    console.log({
      analysisType: type,
      images,
      query,
    });

    onNavigate("result");
  };

  // =========================
  // CHANGE ANALYSIS TYPE
  // =========================

  const changeType = (newType) => {
    setType(newType);
    setImages([]);
  };

  // =========================
  // RENDER
  // =========================

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
        <div className="analysis-page">
          {/* =========================
              PAGE TITLE
          ========================= */}

          <div className="analysis-title">
            <div>
              <small>ANALYSIS WORKSPACE</small>

              <h1>New Analysis</h1>

              <p>
                Upload imagery, select a workflow,
                and ask a natural-language question.
              </p>
            </div>

            <button
              className="outline-button"
              onClick={() => onNavigate("dashboard")}
            >
              <ArrowLeft size={15} />
              Dashboard
            </button>
          </div>

          {/* =========================
              ANALYSIS TYPES
          ========================= */}

          <div className="analysis-tabs">
            <button
              className={
                type === "single" ? "selected" : ""
              }
              onClick={() => changeType("single")}
            >
              Single Image
            </button>

            <button
              className={
                type === "change" ? "selected" : ""
              }
              onClick={() => changeType("change")}
            >
              Change Detection
            </button>

            <button
              className={
                type === "sar" ? "selected" : ""
              }
              onClick={() => changeType("sar")}
            >
              Optical + SAR
            </button>
          </div>

          {/* =========================
              ANALYSIS WORKSPACE
          ========================= */}

          <div className="analysis-workspace">
            {/* =========================
                LEFT SIDE
            ========================= */}

            <div className="analysis-main">
              {/* =========================
                  INPUT IMAGERY
              ========================= */}

              <section className="workspace-card">
                <div className="workspace-card-header">
                  <div>
                    <strong>
                      01 / Input imagery
                    </strong>

                    <span>
                      Supported: GeoTIFF, TIFF, PNG, JPEG
                    </span>
                  </div>

                  <small>
                    {type === "single"
                      ? "OPTICAL"
                      : type === "change"
                      ? "BI-TEMPORAL"
                      : "MULTIMODAL"}
                  </small>
                </div>

                {/* =========================
                    SINGLE IMAGE
                ========================= */}

                {type === "single" && (
                  <label className="upload-area">
                    <input
                      type="file"
                      accept="image/*,.tif,.tiff"
                      onChange={(e) =>
                        handleFiles(e.target.files)
                      }
                    />

                    <Upload size={29} />

                    <strong>
                      Drop satellite imagery here
                    </strong>

                    <span>
                      or click to browse files
                    </span>

                    <small>
                      Maximum demo file size: 500 MB
                    </small>
                  </label>
                )}

                {/* =========================
                    CHANGE DETECTION
                ========================= */}

                {type === "change" && (
                  <div className="dual-upload-grid">
                    {/* BEFORE IMAGE */}

                    <label className="upload-area upload-area-small">
                      <input
                        type="file"
                        accept="image/*,.tif,.tiff"
                        onChange={(e) => {
                          const file =
                            e.target.files?.[0];

                          if (file) {
                            setImages((prev) =>
                              [
                                file,
                                prev[1],
                              ].filter(Boolean)
                            );
                          }
                        }}
                      />

                      <span className="upload-label">
                        BEFORE IMAGE
                      </span>

                      <Upload size={25} />

                      <strong>
                        Upload earlier image
                      </strong>

                      <span>
                        Click or drop file
                      </span>
                    </label>

                    {/* AFTER IMAGE */}

                    <label className="upload-area upload-area-small">
                      <input
                        type="file"
                        accept="image/*,.tif,.tiff"
                        onChange={(e) => {
                          const file =
                            e.target.files?.[0];

                          if (file) {
                            setImages((prev) =>
                              [
                                prev[0],
                                file,
                              ].filter(Boolean)
                            );
                          }
                        }}
                      />

                      <span className="upload-label">
                        AFTER IMAGE
                      </span>

                      <Upload size={25} />

                      <strong>
                        Upload later image
                      </strong>

                      <span>
                        Click or drop file
                      </span>
                    </label>
                  </div>
                )}

                {/* =========================
                    OPTICAL + SAR
                ========================= */}

                {type === "sar" && (
                  <div className="dual-upload-grid">
                    {/* OPTICAL */}

                    <label className="upload-area upload-area-small">
                      <input
                        type="file"
                        accept="image/*,.tif,.tiff"
                        onChange={(e) => {
                          const file =
                            e.target.files?.[0];

                          if (file) {
                            setImages((prev) =>
                              [
                                file,
                                prev[1],
                              ].filter(Boolean)
                            );
                          }
                        }}
                      />

                      <span className="upload-label">
                        OPTICAL IMAGE
                      </span>

                      <Upload size={25} />

                      <strong>
                        Upload optical image
                      </strong>

                      <span>
                        Click or drop file
                      </span>
                    </label>

                    {/* SAR */}

                    <label className="upload-area upload-area-small">
                      <input
                        type="file"
                        accept="image/*,.tif,.tiff"
                        onChange={(e) => {
                          const file =
                            e.target.files?.[0];

                          if (file) {
                            setImages((prev) =>
                              [
                                prev[0],
                                file,
                              ].filter(Boolean)
                            );
                          }
                        }}
                      />

                      <span className="upload-label">
                        SAR IMAGE
                      </span>

                      <Upload size={25} />

                      <strong>
                        Upload SAR image
                      </strong>

                      <span>
                        Click or drop file
                      </span>
                    </label>
                  </div>
                )}

                {/* =========================
                    SELECTED FILES
                ========================= */}

                {images.length > 0 && (
                  <div className="uploaded-files">
                    {images.map((file, index) => (
                      <div
                        className="uploaded-file"
                        key={`${file.name}-${index}`}
                      >
                        <div className="file-icon">
                          <ImageIcon size={17} />
                        </div>

                        <div>
                          <strong>
                            {file.name}
                          </strong>

                          <span>
                            {(
                              file.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </span>
                        </div>

                        <CheckCircle2 size={18} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* =========================
                  NATURAL LANGUAGE QUERY
              ========================= */}

              <section className="workspace-card query-card">
                <div className="workspace-card-header">
                  <div>
                    <strong>
                      02 / Natural-language query
                    </strong>
                  </div>
                </div>

                <textarea
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="Ask something about the uploaded image..."
                />

                <div className="query-footer">
                  <span>
                    → AI will classify your task automatically
                  </span>

                  <button
                    className="primary-button"
                    onClick={handleRun}
                  >
                    Run Analysis
                    <ArrowRight size={17} />
                  </button>
                </div>
              </section>
            </div>

            {/* =========================
                RIGHT PIPELINE
            ========================= */}

            <aside className="analysis-side">
              {/* PIPELINE */}

              <div className="pipeline-card">
                <div className="side-card-header">
                  <strong>
                    AI Execution Pipeline
                  </strong>

                  <span className="ready-badge">
                    ● Ready
                  </span>
                </div>

                <Pipeline
                  number="01"
                  title="Task classification"
                  status="Ready"
                  active
                />

                <Pipeline
                  number="02"
                  title="Model routing"
                  status="Waiting"
                />

                <Pipeline
                  number="03"
                  title="Spatial reasoning"
                  status="Waiting"
                />

                <Pipeline
                  number="04"
                  title="Evidence generation"
                  status="Waiting"
                />
              </div>

              {/* =========================
                  SUGGESTED QUERIES
              ========================= */}

              <div className="suggestions-card">
                <strong>
                  Suggested queries
                </strong>

                <button
                  onClick={() =>
                    setQuery(
                      "Identify all water bodies in this image"
                    )
                  }
                >
                  Identify all water bodies →
                </button>

                <button
                  onClick={() =>
                    setQuery(
                      "What is the dominant land cover?"
                    )
                  }
                >
                  What is the dominant land cover? →
                </button>

                <button
                  onClick={() =>
                    setQuery(
                      "Highlight built-up areas"
                    )
                  }
                >
                  Highlight built-up areas →
                </button>

                <button
                  onClick={() =>
                    setQuery(
                      "Describe the scene"
                    )
                  }
                >
                  Describe the scene →
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

// =========================
// PIPELINE COMPONENT
// =========================

function Pipeline({
  number,
  title,
  status,
  active,
}) {
  return (
    <div className="pipeline-row">
      <div
        className={`pipeline-number ${
          active ? "active" : ""
        }`}
      >
        {number}
      </div>

      <span>{title}</span>

      <small className={active ? "green" : ""}>
        {status}
      </small>
    </div>
  );
}

export default NewAnalysis;