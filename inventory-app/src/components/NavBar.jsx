// src/components/NavBar.jsx

import { NavLink } from 'react-router-dom';
import '../styles/NavBar.css';

export default function NavBar({ alertCount }) {
  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        INV<span>/</span>TRACK
      </div>
      <div className="nav-tabs">
        <NavLink to="/stock-entry" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}>
          Stock Entry
        </NavLink>
        <NavLink to="/stock-exit" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}>
          Stock Exit
        </NavLink>
        <NavLink to="/balance" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}>
          Stock Balance
          {alertCount > 0 && (
            <span className="tab-badge">{alertCount}</span>
          )}
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}>
          History
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`} title="Settings">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </NavLink>
      </div>
    </nav>
  );
}
