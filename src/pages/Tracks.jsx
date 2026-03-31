import { useEffect, useState } from "react";
import { getTracks, deleteTrack } from "../services/TrackService";
import { useNavigate } from "react-router-dom";

function Tracks() {
  const [tracks, setTracks]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await getTracks();
        setTracks(res.data);
      } catch (err) {
        console.error("Error fetching tracks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeleting(id);
      await deleteTrack(id);
      setTracks((prev) => prev.filter((t) => t.id !== id));
      setConfirmId(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = tracks.filter((t) => {
    const matchSearch =
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.location?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const totalTracks = tracks.length;
  const crackCount  = tracks.filter((t) => t.status === "CRACK").length;
  const safeCount   = tracks.filter((t) => t.status === "SAFE").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .tr-root {
          min-height: 100vh;
          background: #070c12;
          font-family: 'Rajdhani', sans-serif;
          color: #e8edf2;
        }

        /* ── TOPBAR ── */
        .tr-topbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 40px;
          border-bottom: 1px solid rgba(241,145,31,0.12);
          background: rgba(13,21,32,0.95);
          backdrop-filter: blur(10px);
          position: sticky; top: 0; z-index: 20;
        }

        .tr-back {
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
        .tr-back:hover { color: #f1911f; border-color: rgba(241,145,31,0.3); }

        .tr-breadcrumb {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          color: #2e3f50;
          letter-spacing: 1px;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .tr-breadcrumb .current { color: #f1911f; }

        .tr-topbar-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tr-status-dot {
          width: 7px; height: 7px;
          background: #22c47a;
          border-radius: 50%;
          box-shadow: 0 0 6px #22c47a;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,100% { opacity:1; } 50% { opacity:0.5; }
        }

        .tr-status-txt {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #4a5a68;
          letter-spacing: 1px;
        }

        /* ── CONTENT ── */
        .tr-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px 60px;
        }

        /* ── PAGE HEADER ── */
        .tr-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .tr-page-header h1 {
          font-size: 36px;
          font-weight: 700;
          color: #e8edf2;
          line-height: 1;
          margin-bottom: 4px;
        }

        .tr-page-header p {
          font-size: 15px;
          color: #4a5a68;
          font-weight: 500;
        }

        .tr-add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          background: linear-gradient(135deg, #f1911f, #e07a0a);
          border: none;
          border-radius: 7px;
          color: #0d1520;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(241,145,31,0.25);
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .tr-add-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        /* ── MINI STATS ── */
        .tr-mini-stats {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .tr-mini-stat {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #0d1520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 12px 20px;
          min-width: 130px;
        }

        .tr-mini-stat-bar {
          width: 3px;
          height: 32px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .tr-mini-stat-value {
          font-size: 26px;
          font-weight: 700;
          line-height: 1;
        }

        .tr-mini-stat-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #4a5a68;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-top: 2px;
        }

        /* ── TOOLBAR ── */
        .tr-toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .tr-search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .tr-search-icon {
          position: absolute;
          left: 14px; top: 50%;
          transform: translateY(-50%);
          color: #4a5a68;
          font-size: 14px;
          pointer-events: none;
        }

        .tr-search {
          width: 100%;
          background: #0d1520;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 7px;
          padding: 11px 14px 11px 38px;
          color: #e8edf2;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .tr-search::placeholder { color: #2e3f50; }
        .tr-search:focus {
          border-color: rgba(241,145,31,0.4);
          box-shadow: 0 0 0 3px rgba(241,145,31,0.07);
        }

        .tr-filter-group {
          display: flex;
          gap: 6px;
        }

        .tr-filter-btn {
          padding: 10px 18px;
          border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.08);
          background: #0d1520;
          color: #4a5a68;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tr-filter-btn.active-all   { background: rgba(59,142,240,0.12); border-color: rgba(59,142,240,0.35); color: #3b8ef0; }
        .tr-filter-btn.active-safe  { background: rgba(34,196,122,0.12); border-color: rgba(34,196,122,0.35); color: #22c47a; }
        .tr-filter-btn.active-crack { background: rgba(241,96,96,0.12);  border-color: rgba(241,96,96,0.35);  color: #f16060; }
        .tr-filter-btn:hover { color: #e8edf2; border-color: rgba(255,255,255,0.18); }

        /* ── TABLE ── */
        .tr-table-wrap {
          background: #0d1520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          overflow: hidden;
        }

        .tr-table-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .tr-table-meta-left {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #4a5a68;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .tr-table-meta-left span {
          color: #f1911f;
          margin-left: 6px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead th {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #4a5a68;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-align: left;
          padding: 12px 20px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          white-space: nowrap;
        }

        tbody td {
          padding: 15px 20px;
          font-size: 15px;
          font-weight: 500;
          color: #c0ccd8;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }

        tbody tr:last-child td { border-bottom: none; }

        tbody tr {
          transition: background 0.15s;
        }
        tbody tr:hover td { background: rgba(255,255,255,0.02); }

        /* id col */
        .col-id {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          color: #2e3f50;
          width: 60px;
        }

        /* status badge */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-family: 'Share Tech Mono', monospace;
        }

        .status-badge.safe  { background: rgba(34,196,122,0.1); color: #22c47a; border: 1px solid rgba(34,196,122,0.2); }
        .status-badge.crack { background: rgba(241,96,96,0.1);  color: #f16060; border: 1px solid rgba(241,96,96,0.25); }

        .status-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .safe  .status-dot { background: #22c47a; }
        .crack .status-dot { background: #f16060; box-shadow: 0 0 5px #f16060; animation: pulse 1.2s ease-in-out infinite; }

        /* action column */
        .col-action { width: 140px; text-align: right; }

        /* delete confirm inline */
        .delete-confirm-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .confirm-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #f16060;
          letter-spacing: 1px;
          white-space: nowrap;
        }

        .btn-confirm-yes {
          padding: 5px 12px;
          background: rgba(241,96,96,0.12);
          border: 1px solid rgba(241,96,96,0.35);
          border-radius: 5px;
          color: #f16060;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-confirm-yes:hover { background: rgba(241,96,96,0.22); }

        .btn-confirm-no {
          padding: 5px 10px;
          background: none;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 5px;
          color: #4a5a68;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .btn-confirm-no:hover { color: #e8edf2; }

        .btn-delete {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: none;
          border: 1px solid rgba(241,96,96,0.2);
          border-radius: 6px;
          color: #f16060;
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          margin-left: auto;
        }
        .btn-delete:hover { background: rgba(241,96,96,0.1); border-color: rgba(241,96,96,0.4); }

        /* spinner */
        .mini-spinner {
          display: inline-block;
          width: 12px; height: 12px;
          border: 2px solid rgba(241,96,96,0.3);
          border-top-color: #f16060;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* empty & loading states */
        .tr-empty {
          text-align: center;
          padding: 60px 20px;
          color: #2e3f50;
        }

        .tr-empty-icon {
          font-size: 36px;
          margin-bottom: 12px;
        }

        .tr-empty p {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .tr-skeleton td {
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .skeleton-bar {
          height: 14px;
          border-radius: 4px;
          background: linear-gradient(90deg, #0d1520 25%, #152030 50%, #0d1520 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        @media (max-width: 700px) {
          .tr-topbar { padding: 14px 16px; }
          .tr-content { padding: 24px 12px 40px; }
          .tr-page-header { flex-direction: column; align-items: flex-start; }
          .col-id { display: none; }
        }
      `}</style>

      <div className="tr-root">
        {/* TOPBAR */}
        <div className="tr-topbar">
          <button className="tr-back" onClick={() => navigate("/dashboard")}>← BACK</button>
          <div className="tr-breadcrumb">
            <span>Dashboard</span>
            <span>/</span>
            <span className="current">Tracks</span>
          </div>
          <div className="tr-topbar-right">
            <div className="tr-status-dot" />
            <span className="tr-status-txt">LIVE</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="tr-content">

          {/* PAGE HEADER */}
          <div className="tr-page-header">
            <div>
              <h1>Track List</h1>
              <p>All registered track segments and their current status</p>
            </div>
            <button className="tr-add-btn" onClick={() => navigate("/add-track")}>
              + Add Track
            </button>
          </div>

          {/* MINI STATS */}
          <div className="tr-mini-stats">
            <div className="tr-mini-stat">
              <div className="tr-mini-stat-bar" style={{ background: "#3b8ef0" }} />
              <div>
                <div className="tr-mini-stat-value" style={{ color: "#3b8ef0" }}>{totalTracks}</div>
                <div className="tr-mini-stat-label">Total</div>
              </div>
            </div>
            <div className="tr-mini-stat">
              <div className="tr-mini-stat-bar" style={{ background: "#22c47a" }} />
              <div>
                <div className="tr-mini-stat-value" style={{ color: "#22c47a" }}>{safeCount}</div>
                <div className="tr-mini-stat-label">Safe</div>
              </div>
            </div>
            <div className="tr-mini-stat">
              <div className="tr-mini-stat-bar" style={{ background: "#f16060" }} />
              <div>
                <div className="tr-mini-stat-value" style={{ color: "#f16060" }}>{crackCount}</div>
                <div className="tr-mini-stat-label">Cracked</div>
              </div>
            </div>
          </div>

          {/* TOOLBAR */}
          <div className="tr-toolbar">
            <div className="tr-search-wrap">
              <span className="tr-search-icon">⌕</span>
              <input
                className="tr-search"
                placeholder="Search by name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="tr-filter-group">
              {["ALL", "SAFE", "CRACK"].map((f) => (
                <button
                  key={f}
                  className={`tr-filter-btn ${filter === f ? `active-${f.toLowerCase()}` : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="tr-table-wrap">
            <div className="tr-table-meta">
              <div className="tr-table-meta-left">
                Showing<span>{filtered.length}</span> of {totalTracks} tracks
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th className="col-id">#</th>
                  <th>Track Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th className="col-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1,2,3,4].map((i) => (
                    <tr className="tr-skeleton" key={i}>
                      <td><div className="skeleton-bar" style={{ width: 30 }} /></td>
                      <td><div className="skeleton-bar" style={{ width: "70%" }} /></td>
                      <td><div className="skeleton-bar" style={{ width: "55%" }} /></td>
                      <td><div className="skeleton-bar" style={{ width: 64 }} /></td>
                      <td><div className="skeleton-bar" style={{ width: 80, marginLeft: "auto" }} /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="tr-empty">
                        <div className="tr-empty-icon">🛤️</div>
                        <p>{search || filter !== "ALL" ? "No matching tracks found" : "No tracks registered yet"}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((track, i) => (
                    <tr key={track.id}>
                      <td className="col-id">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td style={{ color: "#e8edf2", fontWeight: 600 }}>{track.name}</td>
                      <td style={{ color: "#6b7d8e" }}>{track.location}</td>
                      <td>
                        <span className={`status-badge ${track.status === "CRACK" ? "crack" : "safe"}`}>
                          <span className="status-dot" />
                          {track.status}
                        </span>
                      </td>
                      <td className="col-action">
                        {confirmId === track.id ? (
                          <div className="delete-confirm-row">
                            <span className="confirm-text">SURE?</span>
                            <button
                              className="btn-confirm-yes"
                              onClick={() => handleDelete(track.id)}
                              disabled={deleting === track.id}
                            >
                              {deleting === track.id ? <span className="mini-spinner" /> : "YES"}
                            </button>
                            <button className="btn-confirm-no" onClick={() => setConfirmId(null)}>NO</button>
                          </div>
                        ) : (
                          <button className="btn-delete" onClick={() => setConfirmId(track.id)}>
                            🗑 Delete
                          </button>
                        )}
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

export default Tracks;
