import { useState } from "react";
import { addTrack } from "../services/TrackService";
import { useNavigate } from "react-router-dom";

function AddTrack() {
  const navigate = useNavigate();
  const [track, setTrack]     = useState({ name: "", location: "", status: "SAFE" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }

  const handleChange = (e) =>
    setTrack({ ...track, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!track.name.trim() || !track.location.trim()) {
      setMessage({ type: "error", text: "Please fill in all fields before submitting." });
      return;
    }
    try {
      setLoading(true);
      setMessage(null);
      await addTrack(track);
      setMessage({ type: "success", text: "Track registered successfully." });
      setTrack({ name: "", location: "", status: "SAFE" });
    } catch {
      setMessage({ type: "error", text: "Failed to add track. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .at-root {
          min-height: 100vh;
          background: #070c12;
          font-family: 'Rajdhani', sans-serif;
          color: #e8edf2;
          display: flex;
          flex-direction: column;
        }

        /* ── TOPBAR ── */
        .at-topbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 40px;
          border-bottom: 1px solid rgba(241,145,31,0.12);
          background: rgba(13,21,32,0.9);
        }

        .at-back {
          background: none;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          color: #6b7d8e;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          padding: 6px 14px;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }

        .at-back:hover { color: #f1911f; border-color: rgba(241,145,31,0.3); }

        .at-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          color: #2e3f50;
          letter-spacing: 1px;
        }

        .at-breadcrumb .sep { color: #1e2d3b; }
        .at-breadcrumb .current { color: #f1911f; }

        /* ── LAYOUT ── */
        .at-body {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 420px 1fr;
          gap: 0;
          align-items: start;
          padding: 52px 24px;
        }

        .at-panel {
          grid-column: 2;
        }

        .at-header {
          margin-bottom: 32px;
        }

        .at-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #e8edf2;
          margin-bottom: 6px;
        }

        .at-header p {
          font-size: 15px;
          color: #4a5a68;
          font-weight: 500;
        }

        /* ── CARD ── */
        .at-card {
          background: #0d1520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          overflow: hidden;
        }

        .at-card-top {
          padding: 24px 28px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 20px;
        }

        .at-card-icon {
          width: 44px; height: 44px;
          background: rgba(241,145,31,0.1);
          border: 1px solid rgba(241,145,31,0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .at-card-title {
          font-size: 17px;
          font-weight: 700;
          color: #e8edf2;
        }

        .at-card-subtitle {
          font-size: 13px;
          color: #4a5a68;
          font-weight: 500;
        }

        /* ── FORM ── */
        .at-form {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .at-field-label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #f1911f;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .at-input, .at-select {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 7px;
          padding: 13px 16px;
          color: #e8edf2;
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          appearance: none;
        }

        .at-input::placeholder { color: #2e3f50; }

        .at-input:focus, .at-select:focus {
          border-color: rgba(241,145,31,0.45);
          background: rgba(241,145,31,0.03);
          box-shadow: 0 0 0 3px rgba(241,145,31,0.07);
        }

        .at-select-wrap {
          position: relative;
        }

        .at-select-wrap::after {
          content: '▾';
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          color: #4a5a68;
          pointer-events: none;
          font-size: 14px;
        }

        /* status option pills */
        .at-status-toggle {
          display: flex;
          gap: 10px;
        }

        .at-status-btn {
          flex: 1;
          padding: 11px;
          border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          color: #4a5a68;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 1px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .at-status-btn.active-safe {
          background: rgba(34,196,122,0.1);
          border-color: rgba(34,196,122,0.35);
          color: #22c47a;
          box-shadow: 0 0 0 3px rgba(34,196,122,0.08);
        }

        .at-status-btn.active-crack {
          background: rgba(241,96,96,0.1);
          border-color: rgba(241,96,96,0.35);
          color: #f16060;
          box-shadow: 0 0 0 3px rgba(241,96,96,0.08);
        }

        /* ── ALERT ── */
        .at-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border-radius: 7px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 500;
          animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }

        .at-alert.error {
          background: rgba(241,96,96,0.08);
          border: 1px solid rgba(241,96,96,0.2);
          color: #f87171;
        }

        .at-alert.success {
          background: rgba(34,196,122,0.08);
          border: 1px solid rgba(34,196,122,0.2);
          color: #4ade80;
        }

        /* ── SUBMIT ── */
        .at-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 4px 0;
        }

        .at-submit-row {
          display: flex;
          gap: 12px;
        }

        .at-btn-secondary {
          flex: 0 0 auto;
          padding: 13px 20px;
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px;
          color: #4a5a68;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }

        .at-btn-secondary:hover { color: #e8edf2; border-color: rgba(255,255,255,0.2); }

        .at-btn-primary {
          flex: 1;
          padding: 13px;
          background: linear-gradient(135deg, #f1911f, #e07a0a);
          border: none;
          border-radius: 7px;
          color: #0d1520;
          font-family: 'Rajdhani', sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 18px rgba(241,145,31,0.28);
        }

        .at-btn-primary:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(241,145,31,0.38);
        }

        .at-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-spinner {
          display: inline-block;
          width: 13px; height: 13px;
          border: 2px solid rgba(13,21,32,0.3);
          border-top-color: #0d1520;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .at-body { grid-template-columns: 1fr; }
          .at-panel { grid-column: 1; }
        }
      `}</style>

      <div className="at-root">
        {/* TOPBAR */}
        <div className="at-topbar">
          <button className="at-back" onClick={() => navigate("/dashboard")}>← BACK</button>
          <div className="at-breadcrumb">
            <span>Dashboard</span>
            <span className="sep">/</span>
            <span className="current">Add Track</span>
          </div>
        </div>

        {/* BODY */}
        <div className="at-body">
          <div className="at-panel">
            <div className="at-header">
              <h1>Register Track</h1>
              <p>Add a new track segment to the monitoring system</p>
            </div>

            <div className="at-card">
              <div className="at-card-top">
                <div className="at-card-icon">🛤️</div>
                <div>
                  <div className="at-card-title">Track Details</div>
                  <div className="at-card-subtitle">All fields are required</div>
                </div>
              </div>

              <div className="at-form">
                {/* Message */}
                {message && (
                  <div className={`at-alert ${message.type}`}>
                    <span>{message.type === "success" ? "✓" : "⚠"}</span>
                    {message.text}
                  </div>
                )}

                {/* Track Name */}
                <div>
                  <label className="at-field-label">Track Name</label>
                  <input
                    className="at-input"
                    name="name"
                    placeholder="e.g. Track A-07"
                    value={track.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="at-field-label">Location</label>
                  <input
                    className="at-input"
                    name="location"
                    placeholder="e.g. Mumbai Central — Zone 3"
                    value={track.location}
                    onChange={handleChange}
                  />
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="at-field-label">Initial Status</label>
                  <div className="at-status-toggle">
                    <button
                      type="button"
                      className={`at-status-btn ${track.status === "SAFE" ? "active-safe" : ""}`}
                      onClick={() => setTrack({ ...track, status: "SAFE" })}
                    >
                      ● SAFE
                    </button>
                    <button
                      type="button"
                      className={`at-status-btn ${track.status === "CRACK" ? "active-crack" : ""}`}
                      onClick={() => setTrack({ ...track, status: "CRACK" })}
                    >
                      ⚠ CRACK
                    </button>
                  </div>
                </div>

                <hr className="at-divider" />

                {/* Actions */}
                <div className="at-submit-row">
                  <button className="at-btn-secondary" onClick={() => setTrack({ name: "", location: "", status: "SAFE" })}>
                    Clear
                  </button>
                  <button className="at-btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <><span className="btn-spinner" />Saving...</> : "Register Track"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTrack;