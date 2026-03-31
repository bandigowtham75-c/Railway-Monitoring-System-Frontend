import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

export default function Topbar({ title = 'Dashboard' }) {
  const alerts = useSelector(s => s.alerts.list.filter(a => a.alertStatus === 'ACTIVE'));
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const pad = v => String(v).padStart(2,'0');
      setClock(`${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={styles.bar}>
      <div style={styles.left}>
        <span style={styles.title}>{title}</span>
        <span style={styles.badge}>LIVE</span>
      </div>
      <div style={styles.right}>
        <span style={styles.clock}>{clock}</span>
        {/* Alert bell */}
        <div style={styles.bell}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="#7b8eb8" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          {alerts.length > 0 && (
            <span style={styles.alertCount}>{alerts.length}</span>
          )}
        </div>
        {/* Avatar */}
        <div style={styles.avatar}>AK</div>
      </div>
    </div>
  );
}

const styles = {
  bar:        { background: '#101624', borderBottom: '1px solid #1e2d4a',
                padding: '0 24px', height: 54,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0 },
  left:       { display: 'flex', alignItems: 'center', gap: 12 },
  title:      { fontSize: 18, fontWeight: 700, color: '#e8f0fe', letterSpacing: 0.5 },
  badge:      { fontSize: 10, fontFamily: 'monospace',
                background: 'rgba(0,212,255,0.12)', color: '#00d4ff',
                border: '1px solid rgba(0,212,255,0.3)',
                padding: '2px 8px', borderRadius: 4, letterSpacing: 1 },
  right:      { display: 'flex', alignItems: 'center', gap: 16 },
  clock:      { fontFamily: 'monospace', fontSize: 13, color: '#7b8eb8' },
  bell:       { position: 'relative', cursor: 'pointer' },
  alertCount: { position: 'absolute', top: -4, right: -4, background: '#ff1744',
                color: '#fff', fontSize: 9, fontFamily: 'monospace',
                width: 16, height: 16, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, animation: 'blink 1.2s infinite' },
  avatar:     { width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg,#3a7bd5,#00d2ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer' },
};