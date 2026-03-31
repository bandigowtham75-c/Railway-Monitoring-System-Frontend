import { useEffect, useState } from "react";
import { getTracks } from "../services/TrackService";
import { useNavigate } from "react-router-dom";

function Alerts() {
  const [alerts, setAlerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [dismissed, setDismissed] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    getTracks()
      .then((res) => {
        const crackTracks = res.data.filter((t) => t.status === "CRACK");
        setAlerts(crackTracks);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDismiss = (id) => {
    setDismissed((prev) => new Set([...prev, id]));
  };

  const visible = alerts
    .filter((a) => !dismissed.has(a.id))
    .filter(
      (a) =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.location?.toLowerCase().includes(search.toLowerCase())
    );

  const totalAlerts     = alerts.filter((a) => !dismissed.has(a.id)).length;
  const dismissedCount  = dismissed.size;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .al-root {
          min-height: 100vh;
          background: #070c12;
          font-family: 'Rajdhani', sans-serif;
          color: #e8edf2;
        }

        /* ── TOPBAR ── */
        .al-topbar {
          display: flex; align-items: center; gap: 12px;
          padding: 18px 40px;
          border-bottom: 1px solid rgba(241,96,96,0.15);
          background: rgba(13,21,32,0.95);
          backdrop-filter: blur(10px);
          position: sticky; top: 0; z-index: 20;
        }
        .al-back {
          background: none;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          color: #6b7d8e;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px; letter-spacing: 1px;
          padding: 6px 14px; cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .al-back:hover { color: #f16060; border-color: rgba(241,96,96,0.3); }

        .al-breadcrumb {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px; color: #2e3f50;
          letter-spacing: 1px;
          display: flex; gap: 8px; align-items: center;
        }
        .al-breadcrumb .cur { color: #f16060; }

        .al-topbar-right {
          margin-left: auto;
          display: flex; align-items: center; gap: 8px;
        }
        .al-live-badge {
          display: flex; align-items: center; gap: 7px;
          background: rgba(241,96,96,0.08);
          border: 1px solid rgba(241,96,96,0.2);
          border-radius: 20px;
          padding: 5px 13px;
        }
        .al-live-dot {
          width: 7px; height: 7px;
          background: #f16060; border-radius: 50%;
          box-shadow: 0 0 7px #f16060;
          animation: blink 1s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .al-live-txt {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px; color: #f16060; letter-spacing: 1.5px;
        }

        /* ── CONTENT ── */
        .al-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 24px 60px;
        }

        /* ── HERO BANNER ── */
        .al-hero {
          background: #0d1520;
          border: 1px solid rgba(241,96,96,0.2);
          border-radius: 12px;
          padding: 28px 32px;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }
        .al-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at top left, rgba(241,96,96,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .al-hero-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 16px; flex-wrap: wrap;
        }
        .al-hero-left h1 {
          font-size: 34px; font-weight: 700; color: #e8edf2;
          margin-bottom: 4px; line-height: 1;
        }
        .al-hero-left p {
          font-size: 15px; color: #4a5a68; font-weight: 500;
        }

        /* stat pills */
        .al-stat-row {
          display: flex; gap: 10px; flex-wrap: wrap;
          margin-top: 24px;
        }
        .al-stat-pill {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 12px 18px;
        }
        .al-stat-bar { width: 3px; height: 32px; border-radius: 2px; flex-shrink: 0; }
        .al-stat-val  { font-size: 26px; font-weight: 700; line-height: 1; }
        .al-stat-lbl  {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; color: #4a5a68;
          letter-spacing: 1.5px; text-transform: uppercase;
          margin-top: 2px;
        }

        /* severity meter */
        .al-severity {
          margin-top: 20px;
          display: flex; align-items: center; gap: 14px;
        }
        .al-sev-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; color: #4a5a68;
          letter-spacing: 1.5px; text-transform: uppercase;
          white-space: nowrap;
        }
        .al-sev-track {
          flex: 1; height: 5px;
          background: rgba(255,255,255,0.06);
          border-radius: 3px; overflow: hidden;
        }
        .al-sev-fill {
          height: 100%; border-radius: 3px;
          background: linear-gradient(90deg, #f1911f, #f16060);
          transition: width 1s ease;
        }
        .al-sev-pct {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px; color: #f16060;
          white-space: nowrap;
        }

        /* ── TOOLBAR ── */
        .al-toolbar {
          display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
        }
        .al-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .al-search-icon {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%);
          color: #4a5a68; font-size: 14px; pointer-events: none;
        }
        .al-search {
          width: 100%;
          background: #0d1520;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 7px;
          padding: 11px 14px 11px 36px;
          color: #e8edf2;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px; font-weight: 500;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .al-search::placeholder { color: #2e3f50; }
        .al-search:focus {
          border-color: rgba(241,96,96,0.4);
          box-shadow: 0 0 0 3px rgba(241,96,96,0.07);
        }

        /* ── TABLE CARD ── */
        .al-table-card {
          background: #0d1520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; overflow: hidden;
        }
        .al-table-meta {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 14px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .al-meta-txt {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; color: #4a5a68; letter-spacing: 1.5px;
        }
        .al-meta-txt span { color: #f16060; margin-left: 5px; }

        .al-dismiss-all {
          background: none;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 5px;
          color: #4a5a68;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; letter-spacing: 1px;
          padding: 5px 12px; cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .al-dismiss-all:hover { color: #e8edf2; border-color: rgba(255,255,255,0.2); }

        table { width: 100%; border-collapse: collapse; }
        thead th {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; color: #4a5a68;
          letter-spacing: 2px; text-transform: uppercase;
          text-align: left; padding: 11px 20px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          white-space: nowrap;
        }
        tbody td {
          padding: 15px 20px; font-size: 14px;
          font-weight: 500; color: #c0ccd8;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr { transition: background 0.15s; }
        tbody tr:hover td { background: rgba(241,96,96,0.03); }

        .col-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px; color: #2e3f50; width: 50px;
        }

        /* alert row pulse strip */
        .alert-strip {
          width: 3px; height: 100%;
          position: absolute; left: 0; top: 0;
          background: #f16060;
          box-shadow: 0 0 8px #f16060;
          animation: stripPulse 1.5s ease-in-out infinite;
        }
        @keyframes stripPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        tbody tr td:first-child { position: relative; padding-left: 24px; }
        tbody tr td:first-child::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px;
          background: #f16060;
          box-shadow: 0 0 6px #f16060;
          animation: stripPulse 1.5s ease-in-out infinite;
        }

        .crack-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 100px;
          background: rgba(241,96,96,0.1);
          border: 1px solid rgba(241,96,96,0.25);
          color: #f16060;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
        }
        .crack-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #f16060;
          box-shadow: 0 0 5px #f16060;
          animation: blink 1s ease-in-out infinite;
        }

        .btn-dismiss {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 13px; border-radius: 5px;
          background: none;
          border: 1px solid rgba(255,255,255,0.08);
          color: #4a5a68;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; letter-spacing: 1px;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
          margin-left: auto; display: flex;
        }
        .btn-dismiss:hover {
          color: #e8edf2;
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.04);
        }

        /* skeleton */
        .skel td { padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .skel-bar {
          height: 13px; border-radius: 4px;
          background: linear-gradient(90deg, #0d1520 25%, #152030 50%, #0d1520 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

        /* empty / all-clear */
        .al-all-clear {
          text-align: center; padding: 60px 20px;
        }
        .al-clear-icon {
          font-size: 44px; margin-bottom: 14px;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .al-clear-title {
          font-size: 20px; font-weight: 700;
          color: #22c47a; margin-bottom: 6px;
        }
        .al-clear-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px; color: #2e3f50;
          letter-spacing: 1.5px; text-transform: uppercase;
        }

        @media (max-width: 600px) {
          .al-topbar  { padding: 14px 16px; }
          .al-content { padding: 24px 12px 40px; }
          .col-num    { display: none; }
        }
      `}</style>

      <div className="al-root">
        {/* TOPBAR */}
        <div className="al-topbar">
          <button className="al-back" onClick={() => navigate("/dashboard")}>← BACK</button>
          <div className="al-breadcrumb">
            <span>Dashboard</span><span>/</span>
            <span className="cur">Alerts</span>
          </div>
          <div className="al-topbar-right">
            <div className="al-live-badge">
              <div className="al-live-dot" />
              <span className="al-live-txt">MONITORING</span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="al-content">

          {/* HERO BANNER */}
          <div className="al-hero">
            <div className="al-hero-top">
              <div className="al-hero-left">
                <h1>Crack Alerts</h1>
                <p>Track segments flagged with structural integrity issues</p>
              </div>
            </div>

            <div className="al-stat-row">
              {[
                { val: totalAlerts,   lbl: "Active Alerts",    color: "#f16060" },
                { val: dismissedCount,lbl: "Dismissed",         color: "#4a5a68" },
                { val: alerts.length, lbl: "Total Detected",   color: "#f1911f" },
              ].map((s) => (
                <div className="al-stat-pill" key={s.lbl}>
                  <div className="al-stat-bar" style={{ background: s.color }} />
                  <div>
                    <div className="al-stat-val" style={{ color: s.color }}>{s.val}</div>
                    <div className="al-stat-lbl">{s.lbl}</div>
                  </div>
                </div>
              ))}
            </div>

            {alerts.length > 0 && (
              <div className="al-severity">
                <span className="al-sev-label">Alert Severity</span>
                <div className="al-sev-track">
                  <div
                    className="al-sev-fill"
                    style={{ width: `${Math.min(100, (totalAlerts / Math.max(alerts.length, 1)) * 100)}%` }}
                  />
                </div>
                <span className="al-sev-pct">
                  {Math.round((totalAlerts / Math.max(alerts.length, 1)) * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* TOOLBAR */}
          <div className="al-toolbar">
            <div className="al-search-wrap">
              <span className="al-search-icon">⌕</span>
              <input
                className="al-search"
                placeholder="Search by track name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="al-table-card">
            <div className="al-table-meta">
              <div className="al-meta-txt">
                Active alerts<span>{visible.length}</span>
              </div>
              {visible.length > 0 && (
                <button
                  className="al-dismiss-all"
                  onClick={() => setDismissed(new Set(alerts.map((a) => a.id)))}
                >
                  DISMISS ALL
                </button>
              )}
            </div>

            <table>
              <thead>
                <tr>
                  <th className="col-num">#</th>
                  <th>Track Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <tr className="skel" key={i}>
                      <td><div className="skel-bar" style={{ width: 28 }} /></td>
                      <td><div className="skel-bar" style={{ width: "65%" }} /></td>
                      <td><div className="skel-bar" style={{ width: "55%" }} /></td>
                      <td><div className="skel-bar" style={{ width: 72 }} /></td>
                      <td><div className="skel-bar" style={{ width: 90, marginLeft: "auto" }} /></td>
                    </tr>
                  ))
                ) : visible.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="al-all-clear">
                        <div className="al-clear-icon">✅</div>
                        <div className="al-clear-title">All Clear</div>
                        <div className="al-clear-sub">
                          {search
                            ? "No alerts match your search"
                            : "No active crack alerts detected"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  visible.map((alert, i) => (
                    <tr key={alert.id}>
                      <td className="col-num">{String(i + 1).padStart(2, "0")}</td>
                      <td style={{ color: "#e8edf2", fontWeight: 600 }}>{alert.name}</td>
                      <td style={{ color: "#6b7d8e" }}>{alert.location}</td>
                      <td>
                        <span className="crack-badge">
                          <span className="crack-dot" />
                          CRACK
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn-dismiss"
                          onClick={() => handleDismiss(alert.id)}
                        >
                          ✕ Dismiss
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Alerts;
