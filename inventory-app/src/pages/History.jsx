import React, { useState, useMemo } from 'react';
import Badge from '../components/Badge';
import PinModal from '../components/PinModal';
import EditRecordModal from '../components/EditRecordModal';
import { fmtDate } from '../utils/inventory';
import '../styles/History.css';

export default function History({ 
  entries, 
  exits, 
  deleteEntry, 
  deleteExit, 
  adminPin,
  showToast 
}) {
  const [view, setView] = useState('entries'); // 'entries' | 'exits'
  const [modelSearch, setModelSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');

  // PIN authentication state
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { type: 'edit' | 'delete', id: any }

  // Edit Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const rawRecords = view === 'entries' ? entries : exits;

  // Filtered records
  const filteredRecords = useMemo(() => {
    return rawRecords.filter(r => {
      const matchesModel = !modelSearch || r.model.toLowerCase().includes(modelSearch.toLowerCase());
      const matchesDate = !dateSearch || r.date === dateSearch;
      return matchesModel && matchesDate;
    });
  }, [rawRecords, modelSearch, dateSearch]);

  const handleActionClick = (id, actionType) => {
    setPendingAction({ type: actionType, id });
    if (adminPin) {
      setPinModalOpen(true);
    } else {
      executeAction(actionType, id);
    }
  };

  const executeAction = async (actionType, id) => {
    if (actionType === 'delete') {
      if (window.confirm("Are you sure you want to permanently delete this record?")) {
        try {
          if (view === 'entries') {
            await deleteEntry(id);
          } else {
            await deleteExit(id);
          }
          showToast("✓ Record deleted successfully.");
        } catch (err) {
          showToast("⚠ Failed to delete: " + err.message);
        }
      }
    } else if (actionType === 'edit') {
      setSelectedId(id);
      setEditModalOpen(true);
    }
  };

  const handlePinSuccess = () => {
    if (pendingAction) {
      executeAction(pendingAction.type, pendingAction.id);
    }
    setPendingAction(null);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">History Logs</h1>
          <p className="page-sub">View, search, edit, or delete inventory transactions</p>
        </div>
        <div className="view-toggle" style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn ${view === 'entries' ? 'btn-primary' : ''}`}
            onClick={() => { setView('entries'); setModelSearch(''); setDateSearch(''); }}
          >
            Entries
          </button>
          <button 
            className={`btn ${view === 'exits' ? 'btn-primary' : ''}`}
            onClick={() => { setView('exits'); setModelSearch(''); setDateSearch(''); }}
          >
            Exits
          </button>
        </div>
      </div>

      <div className="card">
        {/* Search & Filter Header */}
        <div className="card-header filters-header" style={{ flexWrap: 'wrap', gap: '15px' }}>
          <div className="search-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', color: 'var(--text2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Model No:</label>
            <input
              type="text"
              placeholder="Search model..."
              value={modelSearch}
              onChange={e => setModelSearch(e.target.value)}
              style={{ width: '160px', padding: '6px 10px', fontSize: '13px' }}
            />
          </div>
          <div className="search-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', color: 'var(--text2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date:</label>
            <input
              type="date"
              value={dateSearch}
              onChange={e => setDateSearch(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '13px' }}
            />
          </div>
          {(modelSearch || dateSearch) && (
            <button 
              className="btn btn-sm" 
              onClick={() => { setModelSearch(''); setDateSearch(''); }}
              style={{ padding: '4px 10px', fontSize: '12px' }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="empty" style={{ padding: '60px', textAlign: 'center' }}>
            {rawRecords.length === 0 
              ? `No ${view === 'entries' ? 'entry' : 'exit'} records found in database.`
              : "No records match your search filters."}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Model No.</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  {view === 'exits' && (
                    <>
                      <th>Supplier / Client</th>
                      <th>Location</th>
                    </>
                  )}
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((item, i) => (
                  <tr key={item.id || i}>
                    <td className="mono" style={{ fontSize: '13px', color: 'var(--text2)' }}>
                      {fmtDate(item.date)}
                    </td>
                    <td>
                      <span className="mono" style={{ fontWeight: 600 }}>{item.model}</span>
                    </td>
                    <td style={{ fontWeight: 700 }} className={view === 'entries' ? 'num-in' : 'num-out'}>
                      {view === 'entries' ? `+${item.qty}` : `−${item.qty}`}
                    </td>
                    <td>
                      <Badge variant={item.unit === 'pcs' ? 'blue' : 'neutral'}>
                        {item.unit}
                      </Badge>
                    </td>
                    {view === 'exits' && (
                      <>
                        <td style={{ color: 'var(--text2)', fontSize: '13px' }}>{item.supplier || '-'}</td>
                        <td style={{ color: 'var(--text2)', fontSize: '13px' }}>{item.location || '-'}</td>
                      </>
                    )}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-sm"
                          onClick={() => handleActionClick(item.id, 'edit')}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleActionClick(item.id, 'delete')}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PinModal 
        open={pinModalOpen} 
        onClose={() => { setPinModalOpen(false); setPendingAction(null); }} 
        onSuccess={handlePinSuccess} 
      />

      <EditRecordModal 
        open={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        id={selectedId} 
        type={view} 
      />
    </div>
  );
}
