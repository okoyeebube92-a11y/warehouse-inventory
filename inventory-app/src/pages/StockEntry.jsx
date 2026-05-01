// src/pages/StockEntry.jsx
import { useState } from 'react';
import Badge from '../components/Badge';
import SessionList from '../components/SessionList';
import { todayISO } from '../utils/inventory';
import '../styles/StockEntry.css';

export default function StockEntry({ entries, exits, addEntries, showToast }) {
  const [form, setForm] = useState({
    model: '',
    date:  todayISO(),
    qty:   '',
    unit:  '',
  });
  const [session, setSession] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleClear() {
    setForm({ model: '', date: todayISO(), qty: '', unit: '' });
  }

  function handleAddToList() {
    const model = form.model.trim();
    if (!model)           { showToast('Please enter a model number.'); return; }
    if (!form.date)       { showToast('Please select an entry date.'); return; }
    if (!form.qty || parseInt(form.qty, 10) < 1) { showToast('Please enter a valid quantity.'); return; }
    if (!form.unit)       { showToast('Please select a unit (pcs or ctn).'); return; }

    const item = {
      model: model.toUpperCase(),
      date:  form.date,
      qty:   parseInt(form.qty, 10),
      unit:  form.unit,
    };
    setSession(prev => [...prev, item]);
    setForm(prev => ({ ...prev, model: '', qty: '', unit: '' }));
  }

  function handleRemove(index) {
    setSession(prev => prev.filter((_, i) => i !== index));
  }

  function handleSaveAll() {
    if (session.length === 0) { showToast('Nothing to save. Add entries first.'); return; }
    addEntries(session);
    const count = session.length;
    setSession([]);
    handleClear();
    showToast(`✓ ${count} ${count === 1 ? 'entry' : 'entries'} saved successfully.`);
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Entry</h1>
          <p className="page-sub">Record incoming goods into inventory</p>
        </div>
      </div>

      <div className="entry-layout">
        {/* ---- FORM ---- */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">New Entry</span>
            <Badge variant="blue">Entry</Badge>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label" htmlFor="entry-model">Model Number</label>
              <input
                id="entry-model"
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="e.g. MDL-10042-A"
                autoComplete="off"
              />
              <p className="form-hint">Enter the goods model number or product code</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="entry-date">Entry Date</label>
              <input
                id="entry-date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
              <p className="form-hint">Date this stock was received</p>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity &amp; Unit</label>
              <div className="qty-row">
                <input
                  type="number"
                  name="qty"
                  value={form.qty}
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                />
                <select name="unit" value={form.unit} onChange={handleChange}>
                  <option value="">Select unit</option>
                  <option value="pcs">pcs — pieces</option>
                  <option value="ctn">ctn — cartons</option>
                </select>
              </div>
              <p className="form-hint">Enter quantity then choose pcs or ctn</p>
            </div>

            <div className="btn-row">
              <button className="btn" onClick={handleClear}>Clear</button>
              <button className="btn btn-primary" onClick={handleAddToList}>+ Add to list</button>
            </div>
          </div>
        </div>

        {/* ---- SESSION LIST ---- */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              Added this session — {session.length} {session.length === 1 ? 'entry' : 'entries'}
            </span>
            <button className="btn btn-primary btn-sm" onClick={handleSaveAll}>
              Save all entries
            </button>
          </div>
          <SessionList
            items={session}
            mode="entry"
            onRemove={handleRemove}
            entries={entries}
            exits={exits}
          />
        </div>
      </div>
    </div>
  );
}
