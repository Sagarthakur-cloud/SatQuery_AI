import { useMemo, useState } from "react";

import {
  Search,
  Filter,
  Plus,
  Satellite,
  ScanSearch,
  Radio,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";


function MyAnalyses({
  onNavigate,
  theme,
  onToggleTheme,
}) {

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const analyses = [
    {
      id: 1,
      name: "Water Body Detection",
      type: "Single Image",
      category: "single",
      input: "Sentinel-2",
      date: "Today, 10:42",
      confidence: "94.2%",
      status: "Completed",
    },
    {
      id: 2,
      name: "Urban Expansion",
      type: "Change Detection",
      category: "change",
      input: "Sentinel-2",
      date: "Yesterday, 16:20",
      confidence: "91.8%",
      status: "Completed",
    },
    {
      id: 3,
      name: "Built-up Area Analysis",
      type: "Optical + SAR",
      category: "sar",
      input: "Sentinel-1 + 2",
      date: "Yesterday, 12:05",
      confidence: "89.6%",
      status: "Completed",
    },
    {
      id: 4,
      name: "Agricultural Land Query",
      type: "Single Image",
      category: "single",
      input: "Sentinel-2",
      date: "Sep 14, 2026",
      confidence: "96.1%",
      status: "Completed",
    },
    {
      id: 5,
      name: "Forest Change Analysis",
      type: "Change Detection",
      category: "change",
      input: "Sentinel-2",
      date: "Sep 13, 2026",
      confidence: "88.4%",
      status: "Completed",
    },
    {
      id: 6,
      name: "Flooded Region Detection",
      type: "Optical + SAR",
      category: "sar",
      input: "Sentinel-1 + 2",
      date: "Sep 11, 2026",
      confidence: "92.7%",
      status: "Completed",
    },
  ];


  const filteredAnalyses = useMemo(() => {

    return analyses.filter((analysis) => {

      const searchValue = search.toLowerCase();

      const matchesSearch =
        analysis.name
          .toLowerCase()
          .includes(searchValue) ||
        analysis.type
          .toLowerCase()
          .includes(searchValue) ||
        analysis.input
          .toLowerCase()
          .includes(searchValue);

      const matchesFilter =
        filter === "all" ||
        analysis.category === filter;

      return matchesSearch && matchesFilter;
    });

  }, [search, filter]);


  return (
    <div className="app-layout">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <Sidebar
        active="my-analyses"
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="dashboard">

        <div className="analyses-page">


          {/* =================================
              TITLE
          ================================= */}

          <section className="analyses-title">

            <div>

              <small>
                ANALYSIS HISTORY
              </small>

              <h1>
                My Analyses
              </h1>

              <p>
                Browse and revisit your remote-sensing investigations.
              </p>

            </div>


            <button
              type="button"
              className="primary-button"
              onClick={() =>
                onNavigate("analysis")
              }
            >

              <Plus size={17} />

              New Analysis

            </button>

          </section>


          {/* =================================
              STATS
          ================================= */}

          <section className="analyses-stats">

            <MiniStat
              icon={<ScanSearch size={17} />}
              label="TOTAL ANALYSES"
              value="24"
            />

            <MiniStat
              icon={<Satellite size={17} />}
              label="IMAGES ANALYZED"
              value="56"
            />

            <MiniStat
              icon={<ScanSearch size={17} />}
              label="CHANGE DETECTIONS"
              value="11"
            />

            <MiniStat
              icon={<Radio size={17} />}
              label="AVG. CONFIDENCE"
              value="92.4%"
            />

          </section>


          {/* =================================
              TOOLBAR
          ================================= */}

          <section className="analyses-toolbar">


            {/* SEARCH */}

            <div className="analyses-search">

              <Search size={17} />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search analyses..."
              />

            </div>


            {/* FILTERS */}

            <div className="analysis-filters">

              <Filter size={15} />


              <button
                type="button"
                className={
                  filter === "all"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("all")
                }
              >
                All
              </button>


              <button
                type="button"
                className={
                  filter === "single"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("single")
                }
              >
                Single Image
              </button>


              <button
                type="button"
                className={
                  filter === "change"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("change")
                }
              >
                Change Detection
              </button>


              <button
                type="button"
                className={
                  filter === "sar"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("sar")
                }
              >
                Optical + SAR
              </button>

            </div>

          </section>


          {/* =================================
              TABLE
          ================================= */}

          <section className="analyses-table-card">


            {/* TABLE HEADER */}

            <div className="analyses-table-header">

              <div>

                <h2>
                  Analysis history
                </h2>

                <p>
                  {filteredAnalyses.length} investigations found
                </p>

              </div>

              <span>
                Most recent
              </span>

            </div>


            {/* TABLE */}

            <div className="analyses-table">


              {/* COLUMN HEADERS */}

              <div className="analyses-table-columns">

                <span>
                  ANALYSIS
                </span>

                <span>
                  TYPE
                </span>

                <span>
                  INPUT
                </span>

                <span>
                  CONFIDENCE
                </span>

                <span>
                  DATE
                </span>

                <span>
                  STATUS
                </span>

                <span></span>

              </div>


              {/* ROWS */}

              {filteredAnalyses.length > 0 ? (

                filteredAnalyses.map((analysis) => (

                  <AnalysisRow
                    key={analysis.id}
                    analysis={analysis}
                    onOpen={() =>
                      onNavigate("result")
                    }
                  />

                ))

              ) : (

                <div className="no-analyses">

                  <Search size={25} />

                  <strong>
                    No analyses found
                  </strong>

                  <span>
                    Try another search or filter.
                  </span>

                </div>

              )}

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

function MiniStat({
  icon,
  label,
  value,
}) {

  return (
    <div className="analyses-stat">

      <div className="analyses-stat-icon">
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


/* =========================================================
   ANALYSIS ROW
   ========================================================= */

function AnalysisRow({
  analysis,
  onOpen,
}) {

  const getIcon = () => {

    if (analysis.category === "change") {
      return <ScanSearch size={16} />;
    }

    if (analysis.category === "sar") {
      return <Radio size={16} />;
    }

    return <Satellite size={16} />;
  };


  return (
    <div className="analysis-history-row">


      {/* NAME */}

      <div className="history-analysis-name">

        <div className="history-icon">
          {getIcon()}
        </div>

        <div>

          <strong>
            {analysis.name}
          </strong>

          <small>
            ID: SQ-
            {String(analysis.id).padStart(4, "0")}
          </small>

        </div>

      </div>


      {/* TYPE */}

      <span className="history-type">
        {analysis.type}
      </span>


      {/* INPUT */}

      <span className="history-input">
        {analysis.input}
      </span>


      {/* CONFIDENCE */}

      <span className="history-confidence">
        {analysis.confidence}
      </span>


      {/* DATE */}

      <span className="history-date">
        {analysis.date}
      </span>


      {/* STATUS */}

      <span className="history-status">

        <CheckCircle2 size={13} />

        {analysis.status}

      </span>


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