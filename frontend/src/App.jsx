import { useEffect, useState } from "react";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewAnalysis from "./pages/NewAnalysis";
import AnalysisResult from "./pages/AnalysisResult";
import MyAnalyses from "./pages/MyAnalyses";
import MapExplorer from "./pages/MapExplorer";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import HelpDocs from "./pages/HelpDocs";
import DemoMode from "./pages/DemoMode";

function App() {
  // =========================
  // GET PAGE FROM URL
  // =========================

  const getPageFromUrl = () => {
    const path = window.location.pathname;

    if (path === "/login") return "login";
    if (path === "/dashboard") return "dashboard";
    if (path === "/analysis") return "analysis";
    if (path === "/result") return "result";
    if (path === "/my-analyses") return "my-analyses";
    if (path === "/map") return "map";
    if (path === "/reports") return "reports";
    if (path === "/settings") return "settings";
    if (path === "/help") return "help";
    if (path === "/demo") return "demo";

    return "welcome";
  };

  // =========================
  // APP STATE
  // =========================

  const [page, setPage] = useState(getPageFromUrl);

  const [loggedIn, setLoggedIn] = useState(false);

  const [analysisData, setAnalysisData] = useState(null);

  // =========================
  // THEME
  // =========================

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("satquery-theme") || "dark";
  });

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem("satquery-theme", theme);

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    document.body.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);

  // Toggle dark/light mode
  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  // =========================
  // NAVIGATION
  // =========================

  const navigate = (newPage) => {
    const routes = {
      welcome: "/",
      login: "/login",
      dashboard: "/dashboard",
      analysis: "/analysis",
      result: "/result",
      "my-analyses": "/my-analyses",
      map: "/map",
      reports: "/reports",
      settings: "/settings",
      help: "/help",
      demo: "/demo",
    };

    const newPath = routes[newPage];

    if (!newPath) {
      console.warn(`Unknown route: ${newPage}`);
      return;
    }

    window.history.pushState({}, "", newPath);

    setPage(newPage);
  };

  // =========================
  // BROWSER BACK / FORWARD
  // =========================

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromUrl());
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  // =========================
  // LOGIN
  // =========================

  const goToLogin = () => {
    navigate("login");
  };

  const handleLogin = () => {
    setLoggedIn(true);
    navigate("dashboard");
  };

  // =========================
  // NEW ANALYSIS
  // =========================

  const openNewAnalysis = () => {
    if (!loggedIn) {
      navigate("login");
      return;
    }

    navigate("analysis");
  };

  // =========================
  // RUN ANALYSIS
  // =========================

  const handleRunAnalysis = (data) => {
    setAnalysisData(data);

    navigate("result");
  };

  // =========================
  // SIDEBAR PROPS
  // =========================

  const sidebarProps = {
    theme,
    onToggleTheme: toggleTheme,
  };

  // =========================
  // PAGE RENDER
  // =========================

  return (
    <>
      {/* =========================
          WELCOME
      ========================= */}

      {page === "welcome" && (
  <Welcome
    onStart={goToLogin}
    onDemo={() => navigate("demo")}
  />
)}

{page === "demo" && (
  <DemoMode
    onExit={() => navigate("welcome")}
    onNavigate={navigate}
  />
)}

      {/* =========================
          LOGIN
      ========================= */}

      {page === "login" && (
        <Login onLogin={handleLogin} />
      )}

      {/* =========================
          DASHBOARD
      ========================= */}

      {page === "dashboard" && (
        <Dashboard
          onNewAnalysis={openNewAnalysis}
          onNavigate={navigate}
          {...sidebarProps}
        />
      )}

      {/* =========================
          NEW ANALYSIS
      ========================= */}

      {page === "analysis" && (
        <NewAnalysis
          onNavigate={navigate}
          onRunAnalysis={handleRunAnalysis}
          {...sidebarProps}
        />
      )}

      {/* =========================
          ANALYSIS RESULT
      ========================= */}

      {page === "result" && (
        <AnalysisResult
          onNavigate={navigate}
          analysisData={analysisData}
          {...sidebarProps}
        />
      )}

      {/* =========================
          MY ANALYSES
      ========================= */}

      {page === "my-analyses" && (
        <MyAnalyses
          onNavigate={navigate}
          {...sidebarProps}
        />
      )}

      {/* =========================
          MAP EXPLORER
      ========================= */}

      {page === "map" && (
        <MapExplorer
          onNavigate={navigate}
          {...sidebarProps}
        />
      )}

      {/* =========================
          REPORTS
      ========================= */}

      {page === "reports" && (
        <Reports
          onNavigate={navigate}
          {...sidebarProps}
        />
      )}

      {/* =========================
          SETTINGS
      ========================= */}

      {page === "settings" && (
        <Settings
          onNavigate={navigate}
          {...sidebarProps}
        />
      )}

      {/* =========================
          HELP & DOCS
      ========================= */}

      {page === "help" && (
        <HelpDocs
          onNavigate={navigate}
          {...sidebarProps}
        />
      )}
    </>
  );
}

export default App;