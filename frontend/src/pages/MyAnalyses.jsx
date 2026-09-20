import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Filter,
  Plus,
  Satellite,
  ScanSearch,
  Radio,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { getMyAnalyses } from "../api/api";


function MyAnalyses({ onNavigate, theme, onToggleTheme }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // FETCH ANALYSES FROM BACKEND
  // ============================================
  const fetchAnalyses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyAnalyses();
      
      // GeoJSON format handle karein
      let rawList = [];
      if (data.results?.features) {
        rawList = data.results.features;
      } else if (data.features) {
        rawList = data.features;
      } else if (Array.isArray(data)) {
        rawList = data;
      } else if (data.results && Array.isArray(data.results)) {
        rawList = data.results;
      }

      // Har analysis ko normalize karein
      const normalized = rawList.map((item) => {
        const props = item.properties || item;
        const id = item.id || props.id;

        return {
          id,
          title: props.title || props.query || `Analysis #${id}`,
          query: props.query || "",
          type: props.analysis_type || "single",
          category: props.analysis_type || "single",
          status: props.status || "pending",
          created_at: props.created_at,
          date: props.created_at
            ? new Date(props.created_at).toLocaleString()
            : "—",
          predictions: props.predictions || null,
          images: props.images || [],
        };
      });

      setAnalyses(normalized);
    } catch (err) {
      console.error("Failed to fetch analyses:", err);
      setError("Could not load analyses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  // ============================================
  // FILTER LOGIC
  // ============================================
  const filteredAnalyses = useMemo(() => {
    return analyses.filter((analysis) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        (analysis.title || "").toLowerCase().includes(searchValue) ||
        (analysis.query || "").toLowerCase().includes(searchValue) ||
        (analysis.type || "").toLowerCase().includes(searchValue);

      const matchesFilter =
        filter === "all" ||
        analysis.category === filter ||
        (filter === "completed" && analysis.status === "completed") ||
        (filter === "pending" && analysis.status === "pending") ||
        (filter === "failed" && analysis.status === "failed");

      return matchesSearch && matchesFilter;
    });
  }, [analyses, search, filter]);

  // ============================================
  // STATS
  // ============================================
  const stats = useMemo(() => {
    const total = analyses.length;
    const completed = analyses.filter((a) => a.status === "completed").length;
    const pending = analyses.filter((a) => a.status === "pending").length;
    const withImages = analyses.filter((a) => a.images?.length > 0).length;

    return { total, completed, pending, withImages };
  }, [analyses]);

  // ============================================
  // HANDLE CLICK — navigate with analysis data
  // ============================================
  const handleOpenAnalysis = (analysis) => {
    onNavigate("result", analysis);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="app-layout">
      <Sidebar
        active="my-analyses"
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <main className="dashboard">
        <div className="analyses-page">
          {/* TITLE */}
          <section className="analyses-title">
            <div>
              <small>ANALYSIS HISTORY</small>
              <h1>My Analyses</h1>
              <p>Browse and revisit your remote-sensing investigations.</p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="outline-button"
                onClick={fetchAnalyses}
                disabled={loading}
                title="Refresh"
              >
                <RefreshCw size={16} className={loading ? "spin" : ""} />
                Refresh
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={() => onNavigate("analysis")}
              >
                <Plus size={17} />
                New Analysis
              </button>
            </div>
          </section>

          {/* STATS */}
          <section className="analyses-stats">
            <MiniStat
              icon={<ScanSearch size={17} />}
              label="TOTAL ANALYSES"
              value={stats.total}
            />
            <MiniStat
              icon={<CheckCircle2 size={17} />}
              label="COMPLETED"
              value={stats.completed}
            />
            <MiniStat
              icon={<Loader2 size={17} />}
              label="PENDING"
              value={stats.pending}
            />
            <MiniStat
              icon={<Satellite size={17} />}
              label="WITH IMAGES"
              value={stats.withImages}
            />
          </section>

          {/* TOOLBAR */}
          <section className="analyses-toolbar">
            <div className="analyses-search">
              <Search size={17} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search analyses..."
              />
            </div>

            <div className="analysis-filters">
              <Filter size={15} />

              <button
                type="button"
                className={filter === "all" ? "active" : ""}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={filter === "completed" ? "active" : ""}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
              <button
                type="button"
                className={filter === "pending" ? "active" : ""}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>
              <button
                type="button"
                className={filter === "failed" ? "active" : ""}
                onClick={() => setFilter("failed")}
              >
                Failed
              </button>
            </div>
          </section>

          {/* TABLE */}
          <section className="analyses-table-card">
            <div className="analyses-table-header">
              <div>
                <h2>Analysis history</h2>
                <p>
                  {loading
                    ? "Loading..."
                    : `${filteredAnalyses.length} investigations found`}
                </p>
              </div>
              <span>Most recent</span>
            </div>

            <div className="analyses-table">
              {/* COLUMN HEADERS */}
              <div className="analyses-table-columns">
                <span>ANALYSIS</span>
                <span>TYPE</span>
                <span>INPUT</span>
                <span>STATUS</span>
                <span>DATE</span>
                <span></span>
              </div>

              {/* LOADING */}
              {loading && (
                <div className="no-analyses">
                  <Loader2 size={25} className="spin" />
                  <strong>Loading analyses...</strong>
                  <span>Fetching from backend</span>
                </div>
              )}

              {/* ERROR */}
              {!loading && error && (
                <div className="no-analyses">
                  <AlertCircle size={25} />
                  <strong>Failed to load</strong>
                  <span>{error}</span>
                </div>
              )}

              {/* EMPTY */}
              {!loading && !error && filteredAnalyses.length === 0 && (
                <div className="no-analyses">
                  <Search size={25} />
                  <strong>No analyses found</strong>
                  <span>
                    {analyses.length === 0
                      ? "Start by running your first analysis from the Map Explorer."
                      : "Try another search or filter."}
                  </span>
                </div>
              )}

              {/* ROWS */}
              {!loading &&
                !error &&
                filteredAnalyses.map((analysis) => (
                  <AnalysisRow
                    key={analysis.id}
                    analysis={analysis}
                    onOpen={() => handleOpenAnalysis(analysis)}
                  />
                ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


/* =========================================================
   MINI STAT
========================================================= */
function MiniStat({ icon, label, value }) {
  return (
    <div className="analyses-stat">
      <div className="analyses-stat-icon">{icon}</div>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}


/* =========================================================
   ANALYSIS ROW
========================================================= */
function AnalysisRow({ analysis, onOpen }) {
  const getIcon = () => {
    if (analysis.category === "change") return <ScanSearch size={16} />;
    if (analysis.category === "sar") return <Radio size={16} />;
    return <Satellite size={16} />;
  };

  const getStatusColor = () => {
    if (analysis.status === "completed") return "#22c55e";
    if (analysis.status === "failed") return "#ef4444";
    if (analysis.status === "processing") return "#f59e0b";
    return "#94a3b8";
  };

  const getStatusIcon = () => {
    if (analysis.status === "completed") return <CheckCircle2 size={13} />;
    if (analysis.status === "failed") return <AlertCircle size={13} />;
    if (analysis.status === "processing") return <Loader2 size={13} className="spin" />;
    return <Loader2 size={13} style={{ opacity: 0.5 }} />;
  };

  const getTypeLabel = (t) => {
    const labels = {
      single: "Single Image",
      change: "Change Detection",
      sar: "Optical + SAR",
    };
    return labels[t] || "Single Image";
  };

  return (
    <div className="analysis-history-row">
      {/* NAME */}
      <div className="history-analysis-name">
        <div className="history-icon">{getIcon()}</div>
        <div>
          <strong>
            {analysis.title.length > 40
              ? analysis.title.slice(0, 40) + "..."
              : analysis.title}
          </strong>
          <small>ID: SQ-{String(analysis.id).padStart(4, "0")}</small>
        </div>
      </div>

      {/* TYPE */}
      <span className="history-type">{getTypeLabel(analysis.type)}</span>

      {/* INPUT (Sentinel-2, etc.) */}
      <span className="history-input">
        {analysis.images?.length > 0
          ? `${analysis.images.length} image(s)`
          : "Map Query"}
      </span>

      {/* STATUS */}
      <span
        className="history-status"
        style={{ color: getStatusColor() }}
      >
        {getStatusIcon()}
        {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
      </span>

      {/* DATE */}
      <span className="history-date">{analysis.date}</span>

      {/* ACTION */}
      <button
        type="button"
        className="history-open"
        onClick={onOpen}
        title="Open analysis"
      >
        <ArrowRight size={15} />
      </button>
    </div>
  );
}


export default MyAnalyses;