import { useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  User,
  UserPlus,
  Sparkles,
} from "lucide-react";

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const switchMode = () => {
    setIsSignup((current) => !current);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      if (!username || !email || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }

      if (password.length < 4) {
        setError("Password must contain at least 4 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Frontend-only signup for demo
      setError("");
      setIsSignup(false);
      setPassword("");
      setConfirmPassword("");

      alert("Account created successfully. You can now sign in.");
      return;
    }

    if (username === "demo" && password === "demo") {
      setError("");
      onLogin();
    } else {
      setError("Invalid credentials. Use demo / demo");
    }
  };

  return (
    <div className="login-page">
      <div className="login-grid"></div>
      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>

      <div className="login-container">


        {/* Card */}
        <div className={`login-card ${isSignup ? "signup-card" : ""}`}>

          <div className="login-logo">
            <img
              src="/logo.png"
              alt="SatQuery AI satellite"
              className="login-logo-image"
            />
          </div>

          <div className="login-heading">
            <div className="login-eyebrow">
              {isSignup ? (
                <>
                  <UserPlus size={13} />
                  CREATE ACCOUNT
                </>
              ) : (
                <>
                  <LockKeyhole size={13} />
                  SECURE ACCESS
                </>
              )}
            </div>

            <h1>
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>

            <p>
              {isSignup
                ? "Create your workspace and start exploring satellite intelligence."
                : "Sign in to access your satellite intelligence workspace."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">

            <div className="login-field">
              <label>
                Username
              </label>

              <div className="login-input-wrap">
                <User size={16} />

                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            {isSignup && (
              <div className="login-field">
                <label>
                  Email address
                </label>

                <div className="login-input-wrap">
                  <Mail size={16} />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>
            )}

            <div className="login-field">
              <label>
                Password
              </label>

              <div className="login-input-wrap">
                <LockKeyhole size={16} />

                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                />
              </div>
            </div>

            {isSignup && (
              <div className="login-field">
                <label>
                  Confirm password
                </label>

                <div className="login-input-wrap">
                  <LockKeyhole size={16} />

                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button type="submit" className="login-button">
              <span>
                {isSignup ? "Create account" : "Sign in"}
              </span>

              <ArrowRight size={17} />
            </button>
          </form>

          {/* Demo */}
          {!isSignup && (
            <div className="demo-credentials">
              <LockKeyhole size={14} />
            </div>
          )}

          {/* Switch */}
          <div className="login-switch">
            <span>
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>

            <button
              type="button"
              onClick={switchMode}
            >
              {isSignup ? "Sign in" : "Create account"}
            </button>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <span>SECURE WORKSPACE</span>
            <span className="login-footer-dot"></span>
            <span>SATELLITE INTELLIGENCE</span>
          </div>

        </div>

        <div className="login-bottom-text">
          © 2026 SatQuery AI · Earth Observation Intelligence
        </div>

      </div>
    </div>
  );
}

export default Login;