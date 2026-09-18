import { useState } from "react";
import {
  User,
  Bell,
  ShieldCheck,
  SlidersHorizontal,
  Database,
  Save,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Settings({ onNavigate }) {
  const [name, setName] = useState("SatQuery User");
  const [email, setEmail] = useState("user@satquery.ai");

  const [settings, setSettings] = useState({
    analysisNotifications: true,
    reportNotifications: true,
    darkMap: true,
    autoSave: true,
    highAccuracy: true,
    compactMode: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  return (
    <div className="app-layout">
      <Sidebar active="settings" onNavigate={onNavigate} />

      <main className="dashboard settings-page">
        {/*<header className="dashboard-header">
          <div>
            <span>Workspace</span>
            <b>/</b>
            <strong>Settings</strong>
          </div>

          <div className="header-user">
            ☀ <span>◈</span> ST <span>SatQuery User⌄</span>
          </div>
        </header>*/}

        <div className="settings-content">
          <section className="settings-title">
            <div>
              <div className="eyebrow">WORKSPACE CONFIGURATION</div>
              <h1>Settings</h1>
              <p>
                Manage your SatQuery workspace, analysis preferences and
                notifications.
              </p>
            </div>

            <button className="primary-button" onClick={handleSave}>
              <Save size={16} />
              Save Changes
            </button>
          </section>

          <div className="settings-grid">
            <section className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon">
                  <User size={18} />
                </div>

                <div>
                  <h2>Profile</h2>
                  <p>Basic workspace information</p>
                </div>
              </div>

              <div className="settings-form">
                <label>
                  Display Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <label>
                  Email Address
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                <label>
                  Workspace Plan
                  <input value="Research Plan" disabled />
                </label>
              </div>
            </section>

            <section className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon">
                  <Bell size={18} />
                </div>

                <div>
                  <h2>Notifications</h2>
                  <p>Control analysis and report updates</p>
                </div>
              </div>

              <SettingToggle
                title="Analysis completed"
                description="Notify when an AI analysis finishes."
                active={settings.analysisNotifications}
                onClick={() => toggleSetting("analysisNotifications")}
              />

              <SettingToggle
                title="Report generated"
                description="Notify when a report becomes available."
                active={settings.reportNotifications}
                onClick={() => toggleSetting("reportNotifications")}
              />
            </section>

            <section className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon">
                  <SlidersHorizontal size={18} />
                </div>

                <div>
                  <h2>Analysis Preferences</h2>
                  <p>Configure default AI analysis behavior</p>
                </div>
              </div>

              <SettingToggle
                title="High accuracy mode"
                description="Prioritize confidence over processing speed."
                active={settings.highAccuracy}
                onClick={() => toggleSetting("highAccuracy")}
              />

              <SettingToggle
                title="Auto save analyses"
                description="Automatically save completed analyses."
                active={settings.autoSave}
                onClick={() => toggleSetting("autoSave")}
              />
            </section>

            <section className="settings-card">
              <div className="settings-card-title">
                <div className="settings-icon">
                  <Database size={18} />
                </div>

                <div>
                  <h2>Map & Data</h2>
                  <p>Customize map and dataset preferences</p>
                </div>
              </div>

              <SettingToggle
                title="Dark satellite map"
                description="Use darker visualization in Map Explorer."
                active={settings.darkMap}
                onClick={() => toggleSetting("darkMap")}
              />

              <SettingToggle
                title="Compact interface"
                description="Reduce spacing in data-heavy pages."
                active={settings.compactMode}
                onClick={() => toggleSetting("compactMode")}
              />
            </section>
          </div>

          <section className="settings-security">
            <div className="settings-security-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h3>Workspace Security</h3>
              <p>
                Your current demo workspace uses local frontend state only.
                No external data is being transmitted.
              </p>
            </div>

            <span>
              <CheckCircle2 size={14} />
              Protected
            </span>
          </section>
        </div>
      </main>
    </div>
  );
}

function SettingToggle({ title, description, active, onClick }) {
  return (
    <div className="setting-toggle-row">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <button
        className={`setting-switch ${active ? "active" : ""}`}
        onClick={onClick}
        type="button"
      >
        <span></span>
      </button>
    </div>
  );
}

export default Settings;