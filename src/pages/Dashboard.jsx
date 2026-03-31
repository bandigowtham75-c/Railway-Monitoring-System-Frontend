import { useEffect, useState } from "react";
import { getTracks } from "../services/TrackService";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [tracks, setTracks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getTracks().then((res) => {
      setTracks(res.data);
      setTimeout(() => setLoaded(true), 100);
    });
  }, []);

  const totalTracks = tracks.length;
  const crackTracks = tracks.filter((t) => t.status === "CRACK").length;
  const safeTracks  = tracks.filter((t) => t.status === "SAFE").length;
  const safePercent = totalTracks ? Math.round((safeTracks / totalTracks) * 100) : 0;

  const navItems = [
    { to: "/tracks",      label: "Track List",    icon: "⊞", color: "#3b8ef0", desc: "View all tracks" },
    { to: "/add-track",   label: "Add Track",     icon: "+", color: "#22c47a", desc: "Register new track" },
    { to: "/alerts",      label: "Alerts",        icon: "⚠", color: "#f1911f", desc: "Active crack alerts" },
    { to: "/maintenance", label: "Maintenance",   icon: "⚙", color: "#a78bfa", desc: "Schedule & history" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .db-root {
          min-height: 100vh;
          background: #070c12;
          font-family: 'Rajdhani', sans-serif;
          color: #e8edf2;
          padding: 0 0 60px;
        }

        /* ── TOPBAR ── */
        .db-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 40px;
          border-bottom: 1px solid rgba(241,145,31,0.12);
          background: rgba(13,21,32,0.9);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0; z-index: 10;
        }

        .db-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .db-brand-icon {
          font-size: 22px;
        }

        .db-brand-name {
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          color: #f1911f;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .db-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #4a5a68;
          letter-spacing: 1px;
        }

        .db-status-dot {
          width: 7px; height: 7px;
          background: #22c47a;
          border-radius: 50%;
          box-shadow: 0 0 6px #22c47a;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,100% { opacity:1; } 50% { opacity:0.5; }
        }

        .db-logout {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #4a5a68;
          letter-spacing: 1px;
          background: none;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px;
          padding: 6px 14px;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }

        .db-logout:hover { color: #f1911f; border-color: rgba(241,145,31,0.3); }

        /* ── CONTENT ── */
        .db-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px 0;
        }

        .db-page-title {
          font-size: 36px;
          font-weight: 700;
          color: #e8edf2;
          margin-bottom: 4px;
        }

        .db-page-sub {
          font-size: 15px;
          color: #4a5a68;
          font-weight: 500;
          margin-bottom: 40px;
        }

        /* ── STAT CARDS ── */
        .db-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        .db-stat {
          background: #0d1520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 28px;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .db-stat.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .db-stat:nth-child(2) { transition-delay: 0.1s; }
        .db-stat:nth-child(3) { transition-delay: 0.2s; }

        .db-stat::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          border-radius: 10px 0 0 10px;
        }

        .db-stat.blue::before  { background: #3b8ef0; }
        .db-stat.green::before { background: #22c47a; }
        .db-stat.red::before   { background: #f16060; }

        .db-stat-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #4a5a68;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .db-stat-value {
          font-size: 48px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 10px;
        }

        .db-stat.blue  .db-stat-value { color: #3b8ef0; }
        .db-stat.green .db-stat-value { color: #22c47a; }
        .db-stat.red   .db-stat-value { color: #f16060; }

        .db-stat-desc {
          font-size: 14px;
          color: #4a5a68;
          font-weight: 500;
        }

        /* Progress bar */
        .db-progress-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
        }

        .db-progress-bar {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
        }

        .db-progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 1s ease;
        }

        .green .db-progress-fill { background: #22c47a; }
        .red   .db-progress-fill { background: #f16060; }

        .db-progress-pct {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          color: #4a5a68;
          width: 36px;
          text-align: right;
        }

        /* ── NAV GRID ── */
        .db-section-title {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #4a5a68;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .db-nav-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 40px;
        }

        .db-nav-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          background: #0d1520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 22px 20px;
          text-decoration: none;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }

        .db-nav-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .db-nav-icon {
          width: 40px; height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 700;
        }

        .db-nav-label {
          font-size: 16px;
          font-weight: 700;
          color: #e8edf2;
        }

        .db-nav-desc {
          font-size: 13px;
          color: #4a5a68;
          font-weight: 500;
        }

        /* ── RECENT TABLE ── */
        .db-table-wrap {
          background: #0d1520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          overflow: hidden;
        }

        .db-table-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .db-table-head h3 {
          font-size: 17px;
          font-weight: 600;
          color: #e8edf2;
        }

        .db-table-head a {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #f1911f;
          letter-spacing: 1.5px;
          text-decoration: none;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #4a5a68;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-align: left;
          padding: 12px 24px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        td {
          padding: 14px 24px;
          font-size: 15px;
          font-weight: 500;
          color: #c0ccd8;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.02); }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-family: 'Share Tech Mono', monospace;
        }

        .status-badge.safe  { background: rgba(34,196,122,0.1); color: #22c47a; border: 1px solid rgba(34,196,122,0.2); }
        .status-badge.crack { background: rgba(241,96,96,0.1);  color: #f16060; border: 1px solid rgba(241,96,96,0.2); }

        .status-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
        }

        .safe  .status-dot { background: #22c47a; }
        .crack .status-dot { background: #f16060; box-shadow: 0 0 6px #f16060; animation: pulse 1s ease-in-out infinite; }

        .empty-row td {
          text-align: center;
          color: #2e3f50;
          font-style: italic;
          padding: 40px;
        }

        @media (max-width: 768px) {
          .db-stats    { grid-template-columns: 1fr; }
          .db-nav-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="db-root">
        {/* TOPBAR */}
        <div className="db-topbar">
          <div className="db-brand">
            <span className="db-brand-icon">🚆</span>
            <span className="db-brand-name">Railway Monitor</span>
          </div>
          <div className="db-status">
            <div className="db-status-dot" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
          <button className="db-logout" onClick={() => navigate("/")}>LOGOUT</button>
        </div>

        {/* MAIN */}
        <div className="db-content">
          <h1 className="db-page-title">Dashboard</h1>
          <p className="db-page-sub">Track integrity overview — updated live</p>

          {/* STATS */}
          <div className="db-stats">
            <div className={`db-stat blue ${loaded ? "visible" : ""}`}>
              <div className="db-stat-label">Total Tracks</div>
              <div className="db-stat-value">{totalTracks}</div>
              <div className="db-stat-desc">Registered in system</div>
            </div>

            <div className={`db-stat green ${loaded ? "visible" : ""}`}>
              <div className="db-stat-label">Safe Tracks</div>
              <div className="db-stat-value">{safeTracks}</div>
              <div className="db-progress-row">
                <div className="db-progress-bar">
                  <div className="db-progress-fill" style={{ width: loaded ? `${safePercent}%` : "0%" }} />
                </div>
                <span className="db-progress-pct">{safePercent}%</span>
              </div>
            </div>

            <div className={`db-stat red ${loaded ? "visible" : ""}`}>
              <div className="db-stat-label">Crack Alerts</div>
              <div className="db-stat-value">{crackTracks}</div>
              <div className="db-progress-row">
                <div className="db-progress-bar">
                  <div className="db-progress-fill" style={{ width: loaded && totalTracks ? `${Math.round((crackTracks / totalTracks) * 100)}%` : "0%" }} />
                </div>
                <span className="db-progress-pct">{totalTracks ? Math.round((crackTracks / totalTracks) * 100) : 0}%</span>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="db-section-title">Quick Actions</div>
          <div className="db-nav-grid">
            {navItems.map((item) => (
              <Link to={item.to} className="db-nav-card" key={item.to}
                style={{ "--hov": item.color }}
                onMouseEnter={e => e.currentTarget.style.borderColor = item.color + "44"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
              >
                <div className="db-nav-icon" style={{ background: item.color + "18", color: item.color }}>
                  {item.icon}
                </div>
                <div>
                  <div className="db-nav-label">{item.label}</div>
                  <div className="db-nav-desc">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* TRACK TABLE */}
          <div className="db-section-title">Recent Tracks</div>
          <div className="db-table-wrap">
            <div className="db-table-head">
              <h3>Track Overview</h3>
              <Link to="/tracks">VIEW ALL →</Link>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Track Name</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tracks.length === 0 ? (
                  <tr className="empty-row"><td colSpan={4}>No tracks found. Add your first track.</td></tr>
                ) : (
                  tracks.slice(0, 5).map((t, i) => (
                    <tr key={t.id || i}>
                      <td style={{ color: "#2e3f50", fontFamily: "'Share Tech Mono', monospace" }}>
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td>{t.name}</td>
                      <td style={{ color: "#4a5a68" }}>{t.location}</td>
                      <td>
                        <span className={`status-badge ${t.status === "CRACK" ? "crack" : "safe"}`}>
                          <span className="status-dot" />
                          {t.status}
                        </span>
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

export default Dashboard;