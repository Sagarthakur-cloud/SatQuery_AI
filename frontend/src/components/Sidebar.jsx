import {
  Home,
  Plus,
  Map,
  Files,
  FileText,
  Settings,
  HelpCircle,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";

function Sidebar({
  active,
  onNavigate,
  theme,
  onToggleTheme,
}) {
  // =========================
  // WORKSPACE MENU
  // =========================

  const menu = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      id: "analysis",
      label: "New Analysis",
      icon: Plus,
      badge: "NEW",
    },
    {
      id: "map",
      label: "Map Explorer",
      icon: Map,
    },
    {
      id: "my-analyses",
      label: "My Analyses",
      icon: Files,
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
    },
  ];

  // =========================
  // NAVIGATION
  // =========================

  const handleNavigate = (id) => {
    onNavigate(id);
  };

  // =========================
  // SIDEBAR
  // =========================

  return (
    <aside className="sidebar">
      {/* =========================
          BRAND
      ========================= */}

     <div className="sidebar-brand">
  <div className="brand-icon">
    <img
      src="/logo.jpg"
      alt="SatQuery AI"
      className="sidebar-logo-image"
    />
  </div>

  <div>
    <div className="brand-name">
      SatQuery <span>AI</span>
    </div>

    <div className="brand-subtitle">
      EARTH INTELLIGENCE
    </div>
  </div>
</div>

      {/* =========================
          WORKSPACE
      ========================= */}

      <div className="sidebar-label">
        WORKSPACE
      </div>

      <nav className="sidebar-nav">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-item ${active === item.id ? "active" : ""
                }`}
              onClick={() =>
                handleNavigate(item.id)
              }
            >
              <Icon size={17} />

              <span>{item.label}</span>

              {item.badge && (
                <small>{item.badge}</small>
              )}
            </button>
          );
        })}
      </nav>

      {/* =========================
          SYSTEM
      ========================= */}

      <div className="sidebar-label system-label">
        SYSTEM
      </div>

      <button
        type="button"
        className={`sidebar-item ${active === "settings" ? "active" : ""
          }`}
        onClick={() =>
          handleNavigate("settings")
        }
      >
        <Settings size={17} />
        <span>Settings</span>
      </button>

      <button
        type="button"
        className={`sidebar-item ${active === "help" ? "active" : ""
          }`}
        onClick={() =>
          handleNavigate("help")
        }
      >
        <HelpCircle size={17} />
        <span>Help & Docs</span>
      </button>

      {/* =========================
          BOTTOM AREA
      ========================= */}

      <div className="sidebar-bottom">
        {/* =========================
            THEME TOGGLE
        ========================= */}

        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {/* ICON */}

          <div className="theme-toggle-icon">
            {theme === "dark" ? (
              <Sun size={15} />
            ) : (
              <Moon size={15} />
            )}
          </div>

          {/* LABEL */}

          <span>
            {theme === "dark"
              ? "Light Mode"
              : "Dark Mode"}
          </span>

          {/* SWITCH */}

          <div className="theme-switch">
            <div
              className={`theme-switch-thumb ${theme === "light"
                  ? "light"
                  : ""
                }`}
            />
          </div>
        </button>

        {/* =========================
            USER PROFILE
        ========================= */}

        <div className="user-profile">
          <div className="avatar">
            ST
          </div>

          <div>
            <strong>
              SatQuery User
            </strong>

            <span>
              guest
            </span>
          </div>

          <b>⋮</b>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;