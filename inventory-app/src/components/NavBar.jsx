// src/components/NavBar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/NavBar.css';

export default function NavBar({ alertCount }) {
  const { signOut } = useAuth();
  return (
    <nav className="nav-bar">
      <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
          <path d="M3 21V9l9-5 9 5v12"/>
          <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/>
          <path d="M19 12h-4"/>
          <path d="M9 12H5"/>
        </svg>
        WIMS
      </div>
      <div className="nav-tabs">
        <NavLink to="/balance" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}>
          Stock Balance
          {alertCount > 0 && (
            <span className="tab-badge">{alertCount}</span>
          )}
        </NavLink>
        <NavLink to="/entry-by-date" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}>
          Entry by Date
        </NavLink>
        <NavLink to="/stock-entry" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}>
          Stock Entry
        </NavLink>
        <NavLink to="/stock-exit" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}>
          Stock Exit
        </NavLink>
        <NavLink to="/stock-exited" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}>
          StockExited
        </NavLink>
      </div>
      <div className="nav-actions">
        <button className="btn btn-sm" onClick={signOut} style={{ fontSize: '12px', opacity: 0.8 }}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
