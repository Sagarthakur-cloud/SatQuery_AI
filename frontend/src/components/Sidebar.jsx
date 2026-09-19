import { useEffect, useRef, useState } from "react";
import {
  Home,
  Plus,
  Map,
  Files,
  FileText,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  ChevronUp,
  ChevronDown,
  UserRound,
  LogOut,
} from "lucide-react";

function Sidebar({
  active,
  onNavigate,
  theme,
  onToggleTheme,
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

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
    setIsUserMenuOpen(false);
    onNavigate(id);
  };

  // =========================
  // CLOSE USER MENU
  // WHEN CLICKING OUTSIDE
  // =========================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =========================
  // SIGN OUT
  // =========================

  const handleSignOut = () => {
    setIsUserMenuOpen(false);
    onNavigate("welcome");
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
              className={`sidebar-item ${
                active === item.id ? "active" : ""
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
        className={`sidebar-item ${
          active === "settings" ? "active" : ""
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
        className={`sidebar-item ${
          active === "help" ? "active" : ""
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
          <div className="theme-toggle-icon">
            {theme === "dark" ? (
              <Sun size={15} />
            ) : (
              <Moon size={15} />
            )}
          </div>

          <span>
            {theme === "dark"
              ? "Light Mode"
              : "Dark Mode"}
          </span>

          <div className="theme-switch">
            <div
              className={`theme-switch-thumb ${
                theme === "light"
                  ? "light"
                  : ""
              }`}
            />
          </div>
        </button>

        {/* =========================
            USER PROFILE
        ========================= */}

        <div
          className="user-profile-wrapper"
          ref={userMenuRef}
        >
          <button
            type="button"
            className={`user-profile ${
              isUserMenuOpen
                ? "user-profile-open"
                : ""
            }`}
            onClick={() =>
              setIsUserMenuOpen(
                (current) => !current
              )
            }
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
          >
            <div className="avatar">
              ST
            </div>

            <div className="user-profile-info">
              <strong>
                SatQuery User
              </strong>

              <span>
                guest
              </span>
            </div>

            <div className="user-profile-chevron">
              {isUserMenuOpen ? (
                <ChevronDown size={15} />
              ) : (
                <ChevronUp size={15} />
              )}
            </div>
          </button>

          {/* =========================
              USER MENU
          ========================= */}

          {isUserMenuOpen && (
            <div
              className="user-menu"
              role="menu"
            >
              <div className="user-menu-header">
                <div className="user-menu-avatar">
                  ST
                </div>

                <div>
                  <strong>
                    SatQuery User
                  </strong>

                  <span>
                    Guest account
                  </span>
                </div>
              </div>

              <div className="user-menu-divider"></div>

              <button
                type="button"
                className="user-menu-item"
                onClick={() =>
                  handleNavigate("settings")
                }
              >
                <UserRound size={16} />

                <span>
                  Account Settings
                </span>
              </button>

              <button
                type="button"
                className="user-menu-item user-menu-danger"
                onClick={handleSignOut}
              >
                <LogOut size={16} />

                <span>
                  Sign Out
                </span>
              </button>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}

export default Sidebar;