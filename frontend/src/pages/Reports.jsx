import {
  FileText,
  Download,
  Eye,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  BarChart3,
  Satellite,
  ArrowRight,
} from "lucide-react";

import Sidebar from "../components/Sidebar";


function Reports({
  onNavigate,
  theme,
  onToggleTheme,
}) {

  const reports = [
    {
      id: 1,
      name: "Water Body Detection Report",
      type: "Single Image",
      source: "Sentinel-2",
      confidence: "94.2%",
      date: "Today, 10:48",
      status: "Ready",
    },
    {
      id: 2,
      name: "Urban Expansion Assessment",
      type: "Change Detection",
      source: "Sentinel-2",
      confidence: "91.8%",
      date: "Yesterday, 16:32",
      status: "Ready",
    },
    {
      id: 3,
      name: "Built-up Area Fusion Report",
      type: "Optical + SAR",
      source: "Sentinel-1 + 2",
      confidence: "89.6%",
      date: "Yesterday, 12:17",
      status: "Ready",
    },
    {
      id: 4,
      name: "Agricultural Land Analysis",
      type: "Single Image",
      source: "Sentinel-2",
      confidence: "96.1%",
      date: "Sep 14, 2026",
      status: "Ready",
    },
    {
      id: 5,
      name: "Forest Change Assessment",
      type: "Change Detection",
      source: "Sentinel-2",
      confidence: "88.4%",
      date: "Sep 13, 2026",
      status: "Processing",
    },
  ];


  return (
    <div className="app-layout">


      {/* =====================================
          SIDEBAR
      ===================================== */}

      <Sidebar
        active="reports"
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="dashboard reports-page">

        <div className="reports-content">


          {/* =================================
              TITLE
          ================================= */}

          <section className="reports-title">

            <div>

              <div className="eyebrow">
                DOCUMENT CENTER
              </div>

              <h1>
                Analysis Reports
              </h1>

              <p>
                Review, export and manage reports generated from your
                satellite analyses.
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

              Generate New Report

            </button>

          </section>


          {/* =================================
              STATS
          ================================= */}

          <section className="reports-stats">


            {/* TOTAL REPORTS */}

            <div className="report-stat-card">

              <div className="report-stat-icon">
                <FileText size={19} />
              </div>

              <div>

                <small>
                  TOTAL REPORTS
                </small>

                <strong>
                  24
                </strong>

                <span>
                  +4 this month
                </span>

              </div>

            </div>


            {/* READY */}

            <div className="report-stat-card">

              <div className="report-stat-icon">
                <CheckCircle2 size={19} />
              </div>

              <div>

                <small>
                  READY
                </small>

                <strong>
                  22
                </strong>

                <span>
                  Available to export
                </span>

              </div>

            </div>


            {/* CONFIDENCE */}

            <div className="report-stat-card">

              <div className="report-stat-icon">
                <BarChart3 size={19} />
              </div>

              <div>

                <small>
                  AVG. CONFIDENCE
                </small>

                <strong>
                  92.4%
                </strong>

                <span>
                  Across reports
                </span>

              </div>

            </div>


            {/* DATA SOURCES */}

            <div className="report-stat-card">

              <div className="report-stat-icon">
                <Satellite size={19} />
              </div>

              <div>

                <small>
                  DATA SOURCES
                </small>

                <strong>
                  03
                </strong>

                <span>
                  Optical + SAR
                </span>

              </div>

            </div>

          </section>


          {/* =================================
              TOOLBAR
          ================================= */}

          <section className="reports-toolbar">


            {/* SEARCH */}

            <div className="reports-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search reports..."
              />

            </div>


            {/* FILTER */}

            <button
              type="button"
              className="report-filter-button"
            >

              <Filter size={16} />

              All Reports

            </button>


            {/* RECENT */}

            <button
              type="button"
              className="report-filter-button"
            >

              <Clock3 size={16} />

              Recent

            </button>

          </section>


          {/* =================================
              REPORT LIST
          ================================= */}

          <section className="reports-card">


            {/* HEADER */}

            <div className="reports-card-header">

              <div>

                <h2>
                  Generated Reports
                </h2>

                <p>
                  Recent satellite analysis reports
                </p>

              </div>

              <span>
                24 reports
              </span>

            </div>


            {/* TABLE */}

            <div className="reports-table">


              {/* TABLE HEAD */}

              <div className="reports-table-head">

                <span>
                  REPORT
                </span>

                <span>
                  ANALYSIS TYPE
                </span>

                <span>
                  DATA SOURCE
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

                <span>
                  ACTION
                </span>

              </div>


              {/* REPORT ROWS */}

              {reports.map((report) => (

                <div
                  className="report-row"
                  key={report.id}
                >


                  {/* REPORT NAME */}

                  <div className="report-name">

                    <div className="report-file-icon">
                      <FileText size={17} />
                    </div>

                    <div>

                      <strong>
                        {report.name}
                      </strong>

                      <small>
                        Report #
                        {String(report.id).padStart(
                          3,
                          "0"
                        )}
                      </small>

                    </div>

                  </div>


                  {/* TYPE */}

                  <span>
                    {report.type}
                  </span>


                  {/* SOURCE */}

                  <span>
                    {report.source}
                  </span>


                  {/* CONFIDENCE */}

                  <strong className="report-confidence">
                    {report.confidence}
                  </strong>


                  {/* DATE */}

                  <span>
                    {report.date}
                  </span>


                  {/* STATUS */}

                  <span>

                    <span
                      className={
                        report.status === "Ready"
                          ? "report-status ready"
                          : "report-status processing"
                      }
                    >

                      {report.status === "Ready" ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <Clock3 size={13} />
                      )}

                      {report.status}

                    </span>

                  </span>


                  {/* ACTIONS */}

                  <div className="report-actions">

                    <button
                      type="button"
                      title="View report"
                      onClick={() =>
                        onNavigate("result")
                      }
                    >

                      <Eye size={16} />

                    </button>


                    <button
                      type="button"
                      title="Download report"
                      onClick={() =>
                        alert(
                          "Demo: report download will be connected later."
                        )
                      }
                    >

                      <Download size={16} />

                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>


          {/* =================================
              CTA
          ================================= */}

          <section className="reports-cta">


            <div className="reports-cta-icon">
              <FileText size={22} />
            </div>


            <div>

              <h3>
                Create a detailed satellite report
              </h3>

              <p>
                Run a new analysis and generate an evidence-backed report
                from optical, SAR or change-detection imagery.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                onNavigate("analysis")
              }
            >

              Start Analysis

              <ArrowRight size={16} />

            </button>

          </section>

        </div>

      </main>

    </div>
  );
}


export default Reports;