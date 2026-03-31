import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',   icon: '▦' },
  { to: '/trains',     label: 'Trains',      icon: '🚂' },
  { to: '/alerts',     label: 'Alerts',      icon: '🚨' },
  { to: '/sensors',    label: 'Sensors',     icon: '📡' },
  { to: '/tracks',     label: 'Track Status',icon: '⟵⟶' },
  { to: '/settings',   label: 'Settings',    icon: '⚙' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const { user }  = useSelector(s => s.auth);

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="#fff" strokeWidth="2">
            <path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4"/>
            <circle cx="12" cy="12" r="2" fill="#fff" stroke="none"/>
          </svg>
        </div>
        <div>
          <div style={styles.logoText}>IRMAS</div>
          <div style={styles.logoSub}>Rail Monitor v1.0</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.section}>MONITOR</div>
        {NAV.slice(0, 3).map(n => (
          <NavLink key={n.to} to={n.to} style={({ isActive }) =>
            isActive ? { ...styles.navItem, ...styles.navActive } : styles.navItem}>
            <span style={styles.icon}>{n.icon}</span>{n.label}
          </NavLink>
        ))}
        <div style={styles.section}>SYSTEM</div>
        {NAV.slice(3).map(n => (
          <NavLink key={n.to} to={n.to} style={({ isActive }) =>
            isActive ? { ...styles.navItem, ...styles.navActive } : styles.navItem}>
            <span style={styles.icon}>{n.icon}</span>{n.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom status + logout */}
      <div style={styles.bottom}>
        <div style={styles.statusRow}>
          <span style={styles.dot}/>
          <span style={styles.statusTxt}>System Online</span>
        </div>
        {user && (
          <div style={styles.userRow}>
            <span style={styles.userName}>{user.username}</span>
            <button style={styles.logoutBtn} onClick={() => dispatch(logout())}>
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

const styles = {
  sidebar:   { width: 220, background: '#101624', borderRight: '1px solid #1e2d4a',
               display: 'flex', flexDirection: 'column', flexShrink: 0, minHeight: '100vh' },
  logo:      { padding: '20px 20px 16px', borderBottom: '1px solid #1e2d4a',
               display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon:  { width: 32, height: 32, borderRadius: 6,
               background: 'linear-gradient(135deg,#00d4ff,#0084a0)',
               display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText:  { fontSize: 13, fontWeight: 700, color: '#00d4ff', letterSpacing: 2 },
  logoSub:   { fontSize: 10, color: '#7b8eb8' },
  nav:       { padding: '12px 0', flex: 1 },
  section:   { fontSize: 10, letterSpacing: 2, color: '#7b8eb8',
               padding: '8px 20px 4px', textTransform: 'uppercase' },
  navItem:   { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 20px',
               fontSize: 14, fontWeight: 500, color: '#7b8eb8',
               textDecoration: 'none', borderLeft: '3px solid transparent',
               transition: 'all 0.2s' },
  navActive: { color: '#00d4ff', background: 'rgba(0,212,255,0.08)',
               borderLeftColor: '#00d4ff' },
  icon:      { fontSize: 14, width: 18, textAlign: 'center' },
  bottom:    { padding: 16, borderTop: '1px solid #1e2d4a' },
  statusRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  dot:       { width: 7, height: 7, borderRadius: '50%', background: '#00e676',
               boxShadow: '0 0 6px #00e676' },
  statusTxt: { fontSize: 12, color: '#7b8eb8', fontFamily: 'monospace' },
  userRow:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  userName:  { fontSize: 12, color: '#e8f0fe', fontFamily: 'monospace' },
  logoutBtn: { fontSize: 11, color: '#ff1744', background: 'none',
               border: '1px solid rgba(255,23,68,0.3)', borderRadius: 4,
               padding: '3px 8px', cursor: 'pointer' },
};