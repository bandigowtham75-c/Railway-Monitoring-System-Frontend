import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!form.username || !form.password) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (form.username === "admin" && form.password === "123") {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          display: flex;
          height: 100vh;
          font-family: 'Rajdhani', sans-serif;
          background: #070c12;
          overflow: hidden;
        }

        /* ─── LEFT PANEL ─── */
        .login-left {
          flex: 1.1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 72px;
          overflow: hidden;
          background: #070c12;
        }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(241,145,31,0.06) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(241,145,31,0.06) 40px);
          pointer-events: none;
        }

        .login-left::after {
          content: '';
          position: absolute;
          top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(241,145,31,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(241,145,31,0.1);
          border: 1px solid rgba(241,145,31,0.3);
          border-radius: 4px;
          padding: 8px 14px;
          margin-bottom: 48px;
          width: fit-content;
        }

        .brand-dot {
          width: 8px; height: 8px;
          background: #f1911f;
          border-radius: 50%;
          box-shadow: 0 0 8px #f1911f;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #f1911f; }
          50% { opacity: 0.6; box-shadow: 0 0 16px #f1911f; }
        }

        .brand-badge span {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #f1911f;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .left-headline {
          font-size: 52px;
          font-weight: 700;
          color: #e8edf2;
          line-height: 1.1;
          letter-spacing: -0.5px;
          margin-bottom: 20px;
        }

        .left-headline em {
          font-style: normal;
          color: #f1911f;
        }

        .left-sub {
          font-size: 18px;
          color: #6b7d8e;
          font-weight: 500;
          line-height: 1.5;
          max-width: 380px;
          margin-bottom: 60px;
        }

        .stat-row {
          display: flex;
          gap: 40px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 28px;
          color: #f1911f;
        }

        .stat-label {
          font-size: 12px;
          color: #4a5a68;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .track-visual {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 120px;
          overflow: hidden;
        }

        .track-rail {
          position: absolute;
          bottom: 24px;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(241,145,31,0.4) 20%, rgba(241,145,31,0.4) 80%, transparent);
        }

        .track-rail:first-child { bottom: 40px; }
        .track-rail:last-child  { bottom: 8px; }

        .track-tie {
          position: absolute;
          bottom: 4px;
          width: 4px;
          height: 44px;
          background: rgba(241,145,31,0.15);
          animation: trainPass 4s linear infinite;
        }

        @keyframes trainPass {
          from { left: -10px; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          to   { left: 110%; opacity: 0; }
        }

        /* ─── RIGHT PANEL ─── */
        .login-right {
          flex: 0.9;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #0d1520;
          border-left: 1px solid rgba(241,145,31,0.12);
          padding: 48px;
        }

        .login-card {
          width: 100%;
          max-width: 360px;
        }

        .login-card-header {
          margin-bottom: 36px;
        }

        .login-card-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #e8edf2;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .login-card-header p {
          font-size: 15px;
          color: #4a5a68;
          font-weight: 500;
        }

        .field-group {
          margin-bottom: 20px;
        }

        .field-label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #f1911f;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 13px 16px;
          color: #e8edf2;
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .field-input::placeholder { color: #2e3f50; }

        .field-input:focus {
          border-color: rgba(241,145,31,0.5);
          background: rgba(241,145,31,0.04);
          box-shadow: 0 0 0 3px rgba(241,145,31,0.08);
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 6px;
          padding: 11px 14px;
          margin-bottom: 20px;
          color: #f87171;
          font-size: 14px;
          font-weight: 500;
          animation: shake 0.3s ease;
        }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          margin-top: 8px;
          background: linear-gradient(135deg, #f1911f, #e07a0a);
          border: none;
          border-radius: 6px;
          color: #0d1520;
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(241,145,31,0.3);
          position: relative;
          overflow: hidden;
        }

        .login-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(241,145,31,0.4);
        }

        .login-btn:active:not(:disabled) { transform: translateY(0); }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(13,21,32,0.3);
          border-top-color: #0d1520;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .login-hint {
          margin-top: 28px;
          text-align: center;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #2e3f50;
          letter-spacing: 1px;
        }

        .divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 32px 0;
        }
          
      `}</style>

      <div className="login-root">
        {/* LEFT */}
        <div className="login-left">
          <div className="brand-badge">
            <div className="brand-dot" />
            <span>System Online</span>
          </div>

          <h1 className="left-headline">
            Intelligent Railway Track Monitoring and Alert System
          </h1>

          <p className="left-sub">
            Real-time track integrity surveillance and predictive safety intelligence.
          </p>

          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-value">99.8%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Monitoring</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">&lt;2ms</span>
              <span className="stat-label">Latency</span>
            </div>
          </div>

          <div className="track-visual">
            <div className="track-rail" />
            <div className="track-tie" style={{ animationDelay: "0s" }} />
            <div className="track-tie" style={{ animationDelay: "0.8s" }} />
            <div className="track-tie" style={{ animationDelay: "1.6s" }} />
            <div className="track-tie" style={{ animationDelay: "2.4s" }} />
            <div className="track-tie" style={{ animationDelay: "3.2s" }} />
            <div className="track-rail" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Welcome back</h2>
              
            </div>

            {error && (
              <div className="error-box">
                <span>⚠</span> {error}
              </div>
            )}

            <div className="field-group">
              <label className="field-label">Username</label>
              <input
                className="field-input"
                placeholder="Enter username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? (
                <><span className="btn-spinner" />Authenticating...</>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="login-hint">SECURE OPERATOR ACCESS · v2.4.1</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;