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
    return "welcome";
  };

  const [page, setPage] = useState(getPageFromUrl);
  const [loggedIn, setLoggedIn] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

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
    };

    window.history.pushState({}, "", routes[newPage]);
    setPage(newPage);
  };

  // =========================
  // BROWSER BACK / FORWARD
  // =========================

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromUrl());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
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
  // PAGE RENDER
  // =========================

  return (
    <>
      {/* WELCOME */}
      {page === "welcome" && (
        <Welcome onStart={goToLogin} />
      )}

      {/* LOGIN */}
      {page === "login" && (
        <Login onLogin={handleLogin} />
      )}

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <Dashboard
          onNewAnalysis={openNewAnalysis}
          onNavigate={navigate}
        />
      )}

      {/* NEW ANALYSIS */}
      {page === "analysis" && (
        <NewAnalysis
          onNavigate={navigate}
          onRunAnalysis={handleRunAnalysis}
        />
      )}

      {/* ANALYSIS RESULT */}
      {page === "result" && (
        <AnalysisResult
          onNavigate={navigate}
          analysisData={analysisData}
        />
      )}

      {/* MY ANALYSES */}
      {page === "my-analyses" && (
        <MyAnalyses
          onNavigate={navigate}
        />
      )}


      {page === "map" && (
        <MapExplorer
          onNavigate={navigate}
        />
      )}


      {page === "reports" && (
        <Reports onNavigate={navigate} />
      )}

      {page === "settings" && (
        <Settings onNavigate={navigate} />
      )}

      {page === "help" && (
  <HelpDocs onNavigate={navigate} />
)}
    </>
  );
}

export default App;