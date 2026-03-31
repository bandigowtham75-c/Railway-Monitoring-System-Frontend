import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Maintenance() {
  const [records, setRecords]   = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading]   = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting]   = useState(null);
  const [completing, setCompleting] = useState(null);
  const [message, setMessage]   = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [data, setData] = useState({
    trackId: "", engineer: "", status: "Pending", repairDate: "",
  });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/maintenance");
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!data.trackId || !data.engineer || !data.repairDate) {
      showMsg("error", "Please fill in all fields before scheduling.");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/maintenance", data);
      await fetchData();
      setData({ trackId: "", engineer: "", status: "Pending", repairDate: "" });
      showMsg("success", "Maintenance job scheduled successfully.");
    } catch (err) {
      showMsg("error", "Failed to schedule maintenance.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    try {
      setDeleting(id);
      await axios.delete(`http://localhost:8080/api/maintenance/${id}`);
      await fetchData();
      setConfirmId(null);
    } catch (err) {
      showMsg("error", "Failed to delete record.");
    } finally {
      setDeleting(null);
    }
  };

  const updateStatus = async (id) => {
    try {
      setCompleting(id);
      await axios.put(`http://localhost:8080/api/maintenance/${id}`);
      await fetchData();
      showMsg("success", "Status marked as Completed.");
    } catch (err) {
      showMsg("error", "Failed to update status.");
    } finally {
      setCompleting(null);
    }
  };

  const totalRecords    = records.length;
  const pendingCount    = records.filter((r) => r.status !== "Completed").length;
  const completedCount  = records.filter((r) => r.status === "Completed").length;

  const filtered = filterStatus === "ALL"
    ? records
    : records.filter((r) =>
        filterStatus === "Completed" ? r.status === "Completed" : r.status !== "Completed"
      );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .mn-root {
          min-height: 100vh;
          background: #070c12;
          font-family: 'Rajdhani', sans-serif;
          color: #e8edf2;
        }

        /* ── TOPBAR ── */
        .mn-topbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 40px;
          border-bottom: 1px solid rgba(241,145,31,0.12);
          background: rgba(13,21,32,0.95);
          backdrop-filter: blur(10px);
          position: sticky; top: 0; z-index: 20;
        }
        .mn-back {
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
        .mn-back:hover { color: #f1911f; border-color: rgba(241,145,31,0.3); }
        .mn-breadcrumb {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          color: #2e3f50;
          letter-spacing: 1px;
          display: flex; gap: 8px; align-items: center;
        }
        .mn-breadcrumb .cur { color: #a78bfa; }

        /* ── TOAST ── */
        .mn-toast {
          position: fixed;
          top: 72px; right: 24px;
          z-index: 100;
          display: flex; align-items: center; gap: 10px;
          padding: 13px 18px;
          border-radius: 8px;
          font-size: 14px; font-weight: 600;
          animation: slideIn 0.25s ease, fadeOut 0.4s ease 3.1s forwards;
          max-width: 340px;
        }
        .mn-toast.success {
          background: rgba(34,196,122,0.1);
          border: 1px solid rgba(34,196,122,0.25);
          color: #4ade80;
        }
        .mn-toast.error {
          background: rgba(241,96,96,0.1);
          border: 1px solid rgba(241,96,96,0.25);
          color: #f87171;
          animation: shake 0.3s ease, fadeOut 0.4s ease 3.1s forwards;
        }
        @keyframes slideIn { from { opacity:0; transform: translateX(16px); } to { opacity:1; transform: none; } }
        @keyframes fadeOut { to   { opacity:0; transform: translateX(8px); } }
        @keyframes shake   { 0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)} }

        /* ── CONTENT ── */
        .mn-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px 60px;
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 28px;
          align-items: start;
        }

        /* ── LEFT COLUMN ── */
        .mn-left { display: flex; flex-direction: column; gap: 20px; }

        .mn-page-title { font-size: 32px; font-weight: 700; color: #e8edf2; margin-bottom: 4px; }
        .mn-page-sub   { font-size: 15px; color: #4a5a68; font-weight: 500; }

        /* mini stats */
        .mn-stats {
          display: flex; flex-direction: column; gap: 10px;
        }
        .mn-stat {
          display: flex; align-items: center; gap: 12px;
          background: #0d1520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 14px 18px;
        }
        .mn-stat-bar { width: 3px; height: 36px; border-radius: 2px; flex-shrink: 0; }
        .mn-stat-value { font-size: 28px; font-weight: 700; line-height: 1; }
        .mn-stat-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; color: #4a5a68;
          letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px;
        }

        /* form card */
        .mn-form-card {
          background: #0d1520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          overflow: hidden;
        }
        .mn-form-header {
          display: flex; align-items: center; gap: 12px;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .mn-form-icon {
          width: 40px; height: 40px;
          background: rgba(167,139,250,0.1);
          border: 1px solid rgba(167,139,250,0.2);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .mn-form-title { font-size: 16px; font-weight: 700; color: #e8edf2; }
        .mn-form-sub   { font-size: 13px; color: #4a5a68; }

        .mn-form-body {
          padding: 24px;
          display: flex; flex-direction: column; gap: 16px;
        }

        .mn-label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; color: #a78bfa;
          letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 7px;
        }

        .mn-input, .mn-select {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 7px;
          padding: 12px 14px;
          color: #e8edf2;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px; font-weight: 500;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          appearance: none;
        }
        .mn-input::placeholder { color: #2e3f50; }
        .mn-input:focus, .mn-select:focus {
          border-color: rgba(167,139,250,0.45);
          background: rgba(167,139,250,0.03);
          box-shadow: 0 0 0 3px rgba(167,139,250,0.07);
        }
        .mn-input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.4) sepia(1) saturate(2) hue-rotate(220deg);
          cursor: pointer;
        }

        .mn-select-wrap { position: relative; }
        .mn-select-wrap::after {
          content: '▾';
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          color: #4a5a68; font-size: 13px; pointer-events: none;
        }

        .mn-status-toggle { display: flex; gap: 8px; }
        .mn-status-btn {
          flex: 1; padding: 10px 8px;
          border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          color: #4a5a68;
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .mn-status-btn.active-pending {
          background: rgba(241,145,31,0.1);
          border-color: rgba(241,145,31,0.35);
          color: #f1911f;
        }
        .mn-status-btn.active-completed {
          background: rgba(34,196,122,0.1);
          border-color: rgba(34,196,122,0.35);
          color: #22c47a;
        }

        .mn-form-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); }

        .mn-submit-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #a78bfa, #7c4dff);
          border: none; border-radius: 7px;
          color: #fff;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(167,139,250,0.25);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .mn-submit-btn:hover:not(:disabled) {
          opacity: 0.9; transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(167,139,250,0.35);
        }
        .mn-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-spinner {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px; vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── RIGHT COLUMN (TABLE) ── */
        .mn-right { display: flex; flex-direction: column; gap: 16px; }

        .mn-table-header {
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 10px;
        }
        .mn-table-header h2 { font-size: 22px; font-weight: 700; color: #e8edf2; }
        .mn-filter-group { display: flex; gap: 6px; }
        .mn-filter-btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          background: #0d1520;
          color: #4a5a68;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; letter-spacing: 1.5px;
          cursor: pointer; transition: all 0.2s;
        }
        .mn-filter-btn.active-all       { background: rgba(59,142,240,0.12);  border-color: rgba(59,142,240,0.35);  color: #3b8ef0; }
        .mn-filter-btn.active-pending   { background: rgba(241,145,31,0.12);  border-color: rgba(241,145,31,0.35);  color: #f1911f; }
        .mn-filter-btn.active-completed { background: rgba(34,196,122,0.12);  border-color: rgba(34,196,122,0.35);  color: #22c47a; }

        .mn-table-card {
          background: #0d1520;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; overflow: hidden;
        }

        .mn-table-meta {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .mn-table-meta-txt {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; color: #4a5a68; letter-spacing: 1.5px;
        }
        .mn-table-meta-txt span { color: #a78bfa; margin-left: 5px; }

        table { width: 100%; border-collapse: collapse; }

        thead th {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; color: #4a5a68;
          letter-spacing: 2px; text-transform: uppercase;
          text-align: left; padding: 11px 18px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          white-space: nowrap;
        }

        tbody td {
          padding: 14px 18px; font-size: 14px;
          font-weight: 500; color: #c0ccd8;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr { transition: background 0.15s; }
        tbody tr:hover td { background: rgba(255,255,255,0.02); }

        .col-id-cell {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px; color: #2e3f50;
          width: 50px;
        }

        .status-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 11px; border-radius: 100px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          font-family: 'Share Tech Mono', monospace;
        }
        .status-badge.pending   { background: rgba(241,145,31,0.1); color: #f1911f; border: 1px solid rgba(241,145,31,0.2); }
        .status-badge.completed { background: rgba(34,196,122,0.1); color: #22c47a; border: 1px solid rgba(34,196,122,0.2); }
        .s-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .pending   .s-dot { background: #f1911f; box-shadow: 0 0 5px #f1911f; animation: pulse 1.4s ease-in-out infinite; }
        .completed .s-dot { background: #22c47a; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.5} }

        .date-cell {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px; color: #6b7d8e;
        }

        /* action buttons */
        .action-cell { white-space: nowrap; }
        .action-wrap { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }

        .btn-complete {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 5px;
          background: rgba(34,196,122,0.08);
          border: 1px solid rgba(34,196,122,0.25);
          color: #22c47a;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; letter-spacing: 1px;
          cursor: pointer; transition: background 0.2s;
        }
        .btn-complete:hover:not(:disabled) { background: rgba(34,196,122,0.18); }
        .btn-complete:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-delete {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 5px;
          background: none;
          border: 1px solid rgba(241,96,96,0.2);
          color: #f16060;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; letter-spacing: 1px;
          cursor: pointer; transition: background 0.2s;
        }
        .btn-delete:hover { background: rgba(241,96,96,0.1); border-color: rgba(241,96,96,0.4); }

        .confirm-inline {
          display: flex; align-items: center; gap: 6px; justify-content: flex-end;
        }
        .confirm-txt {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; color: #f16060; letter-spacing: 1px;
        }
        .btn-yes {
          padding: 5px 10px; border-radius: 5px;
          background: rgba(241,96,96,0.1);
          border: 1px solid rgba(241,96,96,0.35);
          color: #f16060;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; cursor: pointer; transition: background 0.2s;
        }
        .btn-yes:hover { background: rgba(241,96,96,0.2); }
        .btn-no {
          padding: 5px 10px; border-radius: 5px;
          background: none;
          border: 1px solid rgba(255,255,255,0.08);
          color: #4a5a68;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; cursor: pointer;
        }
        .btn-no:hover { color: #e8edf2; }

        .mini-spinner {
          display: inline-block; width: 11px; height: 11px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* skeleton & empty */
        .tr-skeleton td { padding: 13px 18px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .skel-bar {
          height: 13px; border-radius: 4px;
          background: linear-gradient(90deg, #0d1520 25%, #152030 50%, #0d1520 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

        .mn-empty {
          text-align: center; padding: 52px 20px;
          color: #2e3f50;
        }
        .mn-empty-icon { font-size: 32px; margin-bottom: 10px; }
        .mn-empty p {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .mn-content { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .mn-topbar { padding: 14px 16px; }
          .mn-content { padding: 24px 12px 40px; }
          .col-id-cell { display: none; }
        }
      `}</style>

      {/* TOAST */}
      {message && (
        <div className={`mn-toast ${message.type}`}>
          <span>{message.type === "success" ? "✓" : "⚠"}</span>
          {message.text}
        </div>
      )}

      <div className="mn-root">
        {/* TOPBAR */}
        <div className="mn-topbar">
          <button className="mn-back" onClick={() => navigate("/dashboard")}>← BACK</button>
          <div className="mn-breadcrumb">
            <span>Dashboard</span><span>/</span>
            <span className="cur">Maintenance</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mn-content">

          {/* ── LEFT: STATS + FORM ── */}
          <div className="mn-left">
            <div>
              <h1 className="mn-page-title">Maintenance</h1>
              <p className="mn-page-sub">Schedule and manage repair jobs</p>
            </div>

            {/* STATS */}
            <div className="mn-stats">
              {[
                { value: totalRecords,   label: "Total Jobs",  color: "#3b8ef0" },
                { value: pendingCount,   label: "Pending",     color: "#f1911f" },
                { value: completedCount, label: "Completed",   color: "#22c47a" },
              ].map((s) => (
                <div className="mn-stat" key={s.label}>
                  <div className="mn-stat-bar" style={{ background: s.color }} />
                  <div>
                    <div className="mn-stat-value" style={{ color: s.color }}>{s.value}</div>
                    <div className="mn-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* FORM CARD */}
            <div className="mn-form-card">
              <div className="mn-form-header">
                <div className="mn-form-icon">⚙️</div>
                <div>
                  <div className="mn-form-title">Schedule Job</div>
                  <div className="mn-form-sub">All fields required</div>
                </div>
              </div>
              <div className="mn-form-body">
                <div>
                  <label className="mn-label">Track ID</label>
                  <input
                    className="mn-input"
                    name="trackId"
                    placeholder="e.g. TRK-042"
                    value={data.trackId}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="mn-label">Engineer Name</label>
                  <input
                    className="mn-input"
                    name="engineer"
                    placeholder="e.g. Rajesh Kumar"
                    value={data.engineer}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="mn-label">Repair Date</label>
                  <input
                    className="mn-input"
                    name="repairDate"
                    type="date"
                    value={data.repairDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="mn-label">Initial Status</label>
                  <div className="mn-status-toggle">
                    {["Pending", "Completed"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`mn-status-btn ${data.status === s ? `active-${s.toLowerCase()}` : ""}`}
                        onClick={() => setData({ ...data, status: s })}
                      >
                        {s === "Pending" ? "⏳" : "✓"} {s}
                      </button>
                    ))}
                  </div>
                </div>
                <hr className="mn-form-divider" />
                <button className="mn-submit-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? <><span className="btn-spinner" />Scheduling...</> : "Schedule Maintenance"}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: TABLE ── */}
          <div className="mn-right">
            <div className="mn-table-header">
              <h2>Maintenance Records</h2>
              <div className="mn-filter-group">
                {["ALL", "PENDING", "COMPLETED"].map((f) => (
                  <button
                    key={f}
                    className={`mn-filter-btn ${filterStatus === f ? `active-${f.toLowerCase()}` : ""}`}
                    onClick={() => setFilterStatus(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="mn-table-card">
              <div className="mn-table-meta">
                <div className="mn-table-meta-txt">
                  Showing<span>{filtered.length}</span> of {totalRecords} records
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th className="col-id-cell">#</th>
                    <th>Track ID</th>
                    <th>Engineer</th>
                    <th>Status</th>
                    <th>Repair Date</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fetching ? (
                    [1,2,3].map((i) => (
                      <tr className="tr-skeleton" key={i}>
                        <td><div className="skel-bar" style={{ width: 28 }} /></td>
                        <td><div className="skel-bar" style={{ width: "60%" }} /></td>
                        <td><div className="skel-bar" style={{ width: "70%" }} /></td>
                        <td><div className="skel-bar" style={{ width: 72 }} /></td>
                        <td><div className="skel-bar" style={{ width: 90 }} /></td>
                        <td><div className="skel-bar" style={{ width: 110, marginLeft: "auto" }} /></td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6}>
                      <div className="mn-empty">
                        <div className="mn-empty-icon">🔧</div>
                        <p>{filterStatus !== "ALL" ? "No matching records" : "No maintenance jobs yet"}</p>
                      </div>
                    </td></tr>
                  ) : (
                    filtered.map((r, i) => {
                      const isDone = r.status === "Completed";
                      return (
                        <tr key={r.id}>
                          <td className="col-id-cell">{String(i + 1).padStart(2, "0")}</td>
                          <td style={{ color: "#e8edf2", fontWeight: 600 }}>{r.trackId}</td>
                          <td>{r.engineer}</td>
                          <td>
                            <span className={`status-badge ${isDone ? "completed" : "pending"}`}>
                              <span className="s-dot" />{r.status}
                            </span>
                          </td>
                          <td className="date-cell">{r.repairDate}</td>
                          <td className="action-cell">
                            {confirmId === r.id ? (
                              <div className="confirm-inline">
                                <span className="confirm-txt">SURE?</span>
                                <button className="btn-yes" onClick={() => deleteRecord(r.id)} disabled={deleting === r.id}>
                                  {deleting === r.id ? <span className="mini-spinner" /> : "YES"}
                                </button>
                                <button className="btn-no" onClick={() => setConfirmId(null)}>NO</button>
                              </div>
                            ) : (
                              <div className="action-wrap">
                                {!isDone && (
                                  <button
                                    className="btn-complete"
                                    onClick={() => updateStatus(r.id)}
                                    disabled={completing === r.id}
                                  >
                                    {completing === r.id ? <span className="mini-spinner" /> : "✓"} DONE
                                  </button>
                                )}
                                <button className="btn-delete" onClick={() => setConfirmId(r.id)}>
                                  🗑 DEL
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Maintenance;
