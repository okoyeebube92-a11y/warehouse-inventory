// src/components/NavBar.jsx

import { NavLink } from 'react-router-dom';
import '../styles/NavBar.css';
import { FiSettings } from 'react-icons/fi';

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
          <FiSettings size={20} />
        </NavLink>
      </div>
    </nav>
  );
}
