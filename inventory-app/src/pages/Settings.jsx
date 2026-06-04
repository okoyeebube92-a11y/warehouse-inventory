import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Settings.css';

export default function Settings({ adminPin, setAdminPin, showToast }) {
  const { user, signOut } = useAuth();
  const [newPin, setNewPin] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSetPin = (e) => {
    e.preventDefault();
    if (!newPin.trim()) {
      showToast('⚠ PIN cannot be empty.');
      return;
    }
    if (newPin !== confirm) {
      showToast('⚠ PINs do not match. Please try again.');
      return;
    }
    setAdminPin(newPin.trim());
    setNewPin('');
    setConfirm('');
    showToast('✓ Admin security PIN updated.');
  };

  const handleRemovePin = () => {
    if (window.confirm("Are you sure you want to disable PIN protection? Anyone will be able to edit or delete records.")) {
      setAdminPin('');
      showToast('✓ Admin security PIN removed.');
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      try {
        await signOut();
        showToast('✓ Signed out successfully.');
      } catch (err) {
        showToast('⚠ Logout failed: ' + err.message);
      }
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Configure security PIN and manage user sessions</p>
        </div>
      </div>

      <div className="settings-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* PIN Security Section */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Admin PIN Configuration</span>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '16px' }}>
              Setting an Admin PIN restricts edit and delete actions on transaction logs to authorized users only.
            </p>
            <form onSubmit={handleSetPin}>
              <div className="form-group">
                <label className="form-label">New PIN</label>
                <input 
                  type="password" 
                  value={newPin} 
                  onChange={e => setNewPin(e.target.value)} 
                  placeholder="Enter numeric PIN"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength="8"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm PIN</label>
                <input 
                  type="password" 
                  value={confirm} 
                  onChange={e => setConfirm(e.target.value)} 
                  placeholder="Re-enter PIN"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength="8"
                  required
                />
              </div>
              <div className="btn-row" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0, display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                {adminPin ? (
                  <button type="button" className="btn btn-danger btn-sm" onClick={handleRemovePin}>
                    Disable PIN
                  </button>
                ) : <span />}
                <button type="submit" className="btn btn-primary btn-sm">
                  {adminPin ? 'Update PIN' : 'Enable PIN'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* User Account Session Section */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">User Account</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 48px)', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '8px' }}>
                You are currently logged in as:
              </p>
              <div className="mono" style={{ fontSize: '14px', fontWeight: 600, padding: '10px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', wordBreak: 'break-all' }}>
                {user?.email || 'N/A'}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '8px' }}>
                Session ID: {user?.id || 'N/A'}
              </p>
            </div>
            
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
                Sign Out / Logout
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
