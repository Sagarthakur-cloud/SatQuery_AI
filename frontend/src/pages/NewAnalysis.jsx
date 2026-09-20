import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createAnalysis, getAnalysisById } from "../api/api";

import {
  Upload,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function NewAnalysis({ onNavigate, onRunAnalysis, theme, onToggleTheme }) {
  const { user } = useAuth();
  const [type, setType] = useState("single");
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

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
  const handleRun = async () => {
    if (images.length === 0) {
      alert("Please upload image first.");
      return;
    }

    if (!query.trim()) {
      alert("Please enter your question.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Analysis create (backend color analysis karega)
      const createResult = await createAnalysis(
        {
          analysis_type: type,
          query: query,
          title: query.slice(0, 60),
          description: "",
        },
        images
      );

      console.log("Create response:", createResult);

      // Step 2: Fresh data fetch karein (predictions ke saath)
      const freshData = await getAnalysisById(createResult.id);
      console.log("Fresh data:", freshData);

      // Step 3: GeoJSON properties extract karein
      const props = freshData.properties || freshData;

      console.log("Props:", props);
      console.log("Predictions:", props.predictions);

      // Step 4: App.jsx ke through result page par bhejein
      if (typeof onRunAnalysis === "function") {
        onRunAnalysis({
          id: freshData.id,
          title: props.title || query.slice(0, 60),
          query: props.query || query,
          analysis_type: props.analysis_type || type,
          status: props.status || "pending",
          images: props.images || [],
          created_at: props.created_at,
          predictions: props.predictions || null,   // <-- YE IMPORTANT HAI
        });
      } else {
        onNavigate("result");
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          "Failed to create analysis. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
      <Sidebar
        active="analysis"
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <main className="dashboard">
        <div className="analysis-page">
          <div className="analysis-title">
            <div>
              <small>ANALYSIS WORKSPACE</small>
              <h1>New Analysis</h1>
              <p>
                Upload imagery, select a workflow, and ask a natural-language
                question.
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

          <div className="analysis-tabs">
            <button
              className={type === "single" ? "selected" : ""}
              onClick={() => changeType("single")}
            >
              Single Image
            </button>
            <button
              className={type === "change" ? "selected" : ""}
              onClick={() => changeType("change")}
            >
              Change Detection
            </button>
            <button
              className={type === "sar" ? "selected" : ""}
              onClick={() => changeType("sar")}
            >
              Optical + SAR
            </button>
          </div>

          <div className="analysis-workspace">
            <div className="analysis-main">
              <section className="workspace-card">
                <div className="workspace-card-header">
                  <div>
                    <strong>01 / Input imagery</strong>
                    <span>Supported: GeoTIFF, TIFF, PNG, JPEG</span>
                  </div>
                  <small>
                    {type === "single"
                      ? "OPTICAL"
                      : type === "change"
                      ? "BI-TEMPORAL"
                      : "MULTIMODAL"}
                  </small>
                </div>

                {type === "single" && (
                  <label className="upload-area">
                    <input
                      type="file"
                      accept="image/*,.tif,.tiff"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                    <Upload size={29} />
                    <strong>Drop satellite imagery here</strong>
                    <span>or click to browse files</span>
                    <small>Maximum demo file size: 500 MB</small>
                  </label>
                )}

                {type === "change" && (
                  <div className="dual-upload-grid">
                    <label className="upload-area upload-area-small">
                      <input
                        type="file"
                        accept="image/*,.tif,.tiff"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImages((prev) =>
                              [file, prev[1]].filter(Boolean)
                            );
                          }
                        }}
                      />
                      <span className="upload-label">BEFORE IMAGE</span>
                      <Upload size={25} />
                      <strong>Upload earlier image</strong>
                      <span>Click or drop file</span>
                    </label>

                    <label className="upload-area upload-area-small">
                      <input
                        type="file"
                        accept="image/*,.tif,.tiff"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImages((prev) =>
                              [prev[0], file].filter(Boolean)
                            );
                          }
                        }}
                      />
                      <span className="upload-label">AFTER IMAGE</span>
                      <Upload size={25} />
                      <strong>Upload later image</strong>
                      <span>Click or drop file</span>
                    </label>
                  </div>
                )}

                {type === "sar" && (
                  <div className="dual-upload-grid">
                    <label className="upload-area upload-area-small">
                      <input
                        type="file"
                        accept="image/*,.tif,.tiff"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImages((prev) =>
                              [file, prev[1]].filter(Boolean)
                            );
                          }
                        }}
                      />
                      <span className="upload-label">OPTICAL IMAGE</span>
                      <Upload size={25} />
                      <strong>Upload optical image</strong>
                      <span>Click or drop file</span>
                    </label>

                    <label className="upload-area upload-area-small">
                      <input
                        type="file"
                        accept="image/*,.tif,.tiff"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImages((prev) =>
                              [prev[0], file].filter(Boolean)
                            );
                          }
                        }}
                      />
                      <span className="upload-label">SAR IMAGE</span>
                      <Upload size={25} />
                      <strong>Upload SAR image</strong>
                      <span>Click or drop file</span>
                    </label>
                  </div>
                )}

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
                          <strong>{file.name}</strong>
                          <span>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <CheckCircle2 size={18} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="workspace-card query-card">
                <div className="workspace-card-header">
                  <div>
                    <strong>02 / Natural-language query</strong>
                  </div>
                </div>

                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask something about the uploaded image..."
                />

                <div className="query-footer">
                  <span>→ AI will classify your task automatically</span>
                  <button
                    className="primary-button"
                    onClick={handleRun}
                    disabled={loading}
                  >
                    {loading ? "Running..." : "Run Analysis"}
                    {!loading && <ArrowRight size={17} />}
                  </button>
                </div>
              </section>
            </div>

            <aside className="analysis-side">
              <div className="pipeline-card">
                <div className="side-card-header">
                  <strong>AI Execution Pipeline</strong>
                  <span className="ready-badge">● Ready</span>
                </div>

                <Pipeline
                  number="01"
                  title="Task classification"
                  status={loading ? "Running" : "Ready"}
                  active
                />
                <Pipeline
                  number="02"
                  title="Color analysis"
                  status={loading ? "Running" : "Waiting"}
                />
                <Pipeline
                  number="03"
                  title="Land cover estimation"
                  status={loading ? "Running" : "Waiting"}
                />
                <Pipeline
                  number="04"
                  title="Evidence generation"
                  status={loading ? "Running" : "Waiting"}
                />
              </div>

              <div className="suggestions-card">
                <strong>Suggested queries</strong>

                <button
                  onClick={() =>
                    setQuery("Identify all water bodies in this image")
                  }
                >
                  Identify all water bodies →
                </button>
                <button
                  onClick={() => setQuery("What is the dominant land cover?")}
                >
                  What is the dominant land cover? →
                </button>
                <button onClick={() => setQuery("Highlight built-up areas")}>
                  Highlight built-up areas →
                </button>
                <button onClick={() => setQuery("Describe the scene")}>
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

function Pipeline({ number, title, status, active }) {
  return (
    <div className="pipeline-row">
      <div className={`pipeline-number ${active ? "active" : ""}`}>
        {number}
      </div>
      <span>{title}</span>
      <small className={active ? "green" : ""}>{status}</small>
    </div>
  );
}

export default NewAnalysis;