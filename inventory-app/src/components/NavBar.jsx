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
        <NavLink to="/entry-by-date" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}>
          Entry by Date
        </NavLink>
        <NavLink to="/balance" className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}>
          Stock Balance
          {alertCount > 0 && (
            <span className="tab-badge">{alertCount}</span>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
