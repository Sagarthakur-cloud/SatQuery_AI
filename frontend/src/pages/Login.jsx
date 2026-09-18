import { useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  Sparkles
} from "lucide-react";

function Login({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "demo" && password === "demo") {
      setError("");
      onLogin();
    } else {
      setError("Invalid credentials. Use demo / demo");
    }
  };

  return (
    <div className="login-page">

      <div className="login-glow"></div>

      <div className="login-card">

        <div className="login-logo">
          <Sparkles size={21} />
        </div>

        <h1>
          Welcome to <span>SatQuery AI</span>
        </h1>

        <p>
          Sign in to access your satellite intelligence workspace.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button className="login-button">
            Sign in
            <ArrowRight size={17} />
          </button>

        </form>

        <div className="demo-credentials">
          <LockKeyhole size={14} />
          Demo access: <b>demo / demo</b>
        </div>

      </div>

    </div>
  );
}

export default Login;