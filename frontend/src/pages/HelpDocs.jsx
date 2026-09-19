import { useState } from "react";
import {
  Search,
  BookOpen,
  MessageCircleQuestion,
  Rocket,
  Satellite,
  Brain,
  FileText,
  ChevronDown,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function HelpDocs({
  onNavigate,
  theme,
  onToggleTheme,
}) {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      question: "What can I analyze with SatQuery AI?",
      answer:
        "SatQuery AI supports single-image analysis, change detection between two images, and multimodal Optical + SAR analysis.",
    },
    {
      question: "Which satellite imagery can I use?",
      answer:
        "The prototype workspace is designed around common optical and SAR sources such as Sentinel-1, Sentinel-2 and Landsat imagery.",
    },
    {
      question: "How do I start a new analysis?",
      answer:
        "Open New Analysis from the sidebar, select an analysis mode, upload the required imagery, enter your natural-language question and run the analysis.",
    },
    {
      question: "What does the confidence score mean?",
      answer:
        "The confidence score represents the model's estimated confidence in the displayed analysis result. It should be interpreted alongside the visual evidence.",
    },
    {
      question: "Can I generate a report from an analysis?",
      answer:
        "Yes. Completed analyses can be presented as reports in the Reports workspace. Report export is currently represented as a frontend prototype action.",
    },
  ];

  const guides = [
    {
      icon: Rocket,
      title: "Getting Started",
      description:
        "Learn the basic SatQuery workflow from imagery upload to analysis.",
    },
    {
      icon: Satellite,
      title: "Satellite Imagery",
      description:
        "Understand Optical, SAR and change-detection input requirements.",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description:
        "Learn how natural-language queries are used across analysis modes.",
    },
    {
      icon: FileText,
      title: "Reports",
      description:
        "Review generated reports, evidence and confidence information.",
    },
  ];

  const filteredGuides = guides.filter((guide) =>
    `${guide.title} ${guide.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">

      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar
        active="help"
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="dashboard help-page">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>
            <span>Workspace</span>
            <b>/</b>
            <strong>Help & Docs</strong>
          </div>

          <div className="header-user">
            ☀
            <span>◈</span>
            ST
            <span>SatQuery User⌄</span>
          </div>

        </header>


        <div className="help-content">

          {/* =========================
              HERO
          ========================= */}

          <section className="help-hero">

            <div className="help-hero-content">

              <div className="eyebrow">
                SATQUERY KNOWLEDGE CENTER
              </div>

              <h1>
                How can we
                <span> help?</span>
              </h1>

              <p>
                Explore guides, learn about satellite analysis and find
                answers to common SatQuery AI questions.
              </p>


              <div className="help-search">

                <Search size={18} />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documentation..."
                />

                <kbd>
                  ⌘ K
                </kbd>

              </div>

            </div>


            <div className="help-hero-icon">
              <BookOpen
                size={48}
                strokeWidth={1.3}
              />
            </div>

          </section>


          {/* =========================
              DOCUMENTATION
          ========================= */}

          <section className="help-section">

            <div className="help-section-header">

              <div>

                <h2>
                  Documentation
                </h2>

                <p>
                  Learn the core SatQuery AI workflows.
                </p>

              </div>

            </div>


            <div className="help-guide-grid">

              {filteredGuides.map((guide) => {

                const Icon = guide.icon;

                return (
                  <button
                    className="help-guide-card"
                    key={guide.title}
                  >

                    <div className="help-guide-icon">
                      <Icon size={20} />
                    </div>


                    <div className="help-guide-body">

                      <h3>
                        {guide.title}
                      </h3>

                      <p>
                        {guide.description}
                      </p>

                    </div>


                    <ArrowRight size={16} />

                  </button>
                );
              })}


              {filteredGuides.length === 0 && (
                <div className="help-empty">
                  No documentation found for "{search}".
                </div>
              )}

            </div>

          </section>


          {/* =========================
              QUICK START
          ========================= */}

          <section className="help-section">

            <div className="help-section-header">

              <div>

                <h2>
                  Quick Start
                </h2>

                <p>
                  Follow these steps to run your first analysis.
                </p>

              </div>


              <button
                className="help-link-button"
                onClick={() => onNavigate("analysis")}
              >
                Open New Analysis
                <ArrowRight size={15} />
              </button>

            </div>


            <div className="quick-start-grid">

              <div className="quick-step">

                <div className="quick-step-number">
                  01
                </div>

                <Satellite size={19} />

                <h3>
                  Select imagery
                </h3>

                <p>
                  Choose Single Image, Change Detection or Optical + SAR.
                </p>

              </div>


              <div className="quick-step">

                <div className="quick-step-number">
                  02
                </div>

                <MessageCircleQuestion size={19} />

                <h3>
                  Ask a question
                </h3>

                <p>
                  Describe what you want to identify or understand.
                </p>

              </div>


              <div className="quick-step">

                <div className="quick-step-number">
                  03
                </div>

                <Brain size={19} />

                <h3>
                  Run AI analysis
                </h3>

                <p>
                  Submit your query and review the generated evidence.
                </p>

              </div>


              <div className="quick-step">

                <div className="quick-step-number">
                  04
                </div>

                <FileText size={19} />

                <h3>
                  Review report
                </h3>

                <p>
                  Inspect findings, confidence and visual evidence.
                </p>

              </div>

            </div>

          </section>


          {/* =========================
              FAQ
          ========================= */}

          <section className="help-section faq-section">

            <div className="help-section-header">

              <div>

                <h2>
                  Frequently Asked Questions
                </h2>

                <p>
                  Common questions about the SatQuery workspace.
                </p>

              </div>

            </div>


            <div className="faq-list">

              {faqs.map((faq, index) => {

                const isOpen = openFaq === index;

                return (
                  <div
                    className={`faq-item ${
                      isOpen ? "open" : ""
                    }`}
                    key={faq.question}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(
                          isOpen ? -1 : index
                        )
                      }
                    >

                      <span>
                        {faq.question}
                      </span>

                      <ChevronDown
                        size={17}
                        className={
                          isOpen ? "rotate" : ""
                        }
                      />

                    </button>


                    {isOpen && (
                      <div className="faq-answer">
                        {faq.answer}
                      </div>
                    )}

                  </div>
                );
              })}

            </div>

          </section>


          {/* =========================
              SUPPORT
          ========================= */}

          <section className="help-support">

            <div className="help-support-icon">
              <MessageCircleQuestion size={22} />
            </div>


            <div>

              <h3>
                Still need help?
              </h3>

              <p>
                This prototype includes the core SatQuery workflow and
                documentation structure.
              </p>

            </div>


            <button
              onClick={() =>
                alert(
                  "Support contact will be connected later."
                )
              }
            >
              Contact Support
              <ExternalLink size={14} />
            </button>

          </section>

        </div>

      </main>

    </div>
  );
}


export default HelpDocs;