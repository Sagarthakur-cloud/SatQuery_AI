import {
  Home,
  Plus,
  Map,
  Files,
  FileText,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";

function Sidebar({ active, onNavigate }) {
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

  const handleNavigate = (id) => {
    onNavigate(id);
  };

  return (
    <aside className="sidebar">

      {/* BRAND */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Sparkles size={18} />
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


      {/* WORKSPACE */}
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
              onClick={() => handleNavigate(item.id)}
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


      {/* SYSTEM */}
      <div className="sidebar-label system-label">
        SYSTEM
      </div>

      <button
        type="button"
        className={`sidebar-item ${
          active === "settings" ? "active" : ""
        }`}
        onClick={() => handleNavigate("settings")}
      >
        <Settings size={17} />
        <span>Settings</span>
      </button>

      <button
        type="button"
        className={`sidebar-item ${
          active === "help" ? "active" : ""
        }`}
        onClick={() => handleNavigate("help")}
      >
        <HelpCircle size={17} />
        <span>Help & Docs</span>
      </button>


      {/* BOTTOM */}
      <div className="sidebar-bottom">

        {/* PLAN
        <div className="research-plan">
          <div className="plan-icon">
            <Sparkles size={16} />
          </div>

          <div>
            <strong>Research Plan</strong>
            <span>Prototype workspace</span>
          </div>

          <small>PRO</small>
        </div>
        */}
        


        {/* USER */}
        <div className="user-profile">
          <div className="avatar">
            ST
          </div>

          <div>
            <strong>SatQuery User</strong>
            <span>guest</span>
          </div>

          <b>⋮</b>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;