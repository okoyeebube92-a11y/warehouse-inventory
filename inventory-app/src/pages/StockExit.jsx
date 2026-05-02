// src/pages/StockExit.jsx
import { useState, useMemo } from 'react';
import Badge from '../components/Badge';
import StatusBadge from '../components/StatusBadge';
import SessionList from '../components/SessionList';
import { todayISO, getBalance, getUnit, getStatus } from '../utils/inventory';
import '../styles/StockExit.css';

export default function StockExit({ entries, exits, addExits, showToast }) {
  const [form, setForm] = useState({
    model: '',
    date:  todayISO(),
    qty:   '',
    unit:  '',
    supplier: '',
    location: '',
  });
  const [session, setSession] = useState([]);

  // Live lookup whenever model changes
  const lookup = useMemo(() => {
    const model = form.model.trim().toUpperCase();
    if (!model) return null;
    const hasEntry = entries.some(e => e.model === model);
    if (!hasEntry) return { found: false };
    const balance = getBalance(model, entries, exits);
    const unit    = getUnit(model, entries, exits);
    const status  = getStatus(balance);
    return { found: true, balance, unit, status };
  }, [form.model, entries, exits]);

  const remainingHint = useMemo(() => {
    if (!lookup?.found || !form.qty) return null;
    const qty = parseInt(form.qty, 10) || 0;
    const remaining = lookup.balance - qty;
    return { remaining, unit: lookup.unit, overLimit: remaining < 0 };
  }, [lookup, form.qty]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleClear() {
    setForm({ model: '', date: todayISO(), qty: '', unit: '', supplier: '', location: '' });
  }

  function handleAddToList() {
    const model = form.model.trim();
    if (!model)     { showToast('Please enter a model number.'); return; }
    if (!form.date) { showToast('Please select an exit date.');  return; }
    const qty = parseInt(form.qty, 10);
    if (!qty || qty < 1) { showToast('Please enter a valid quantity.'); return; }
    if (!form.unit) { showToast('Please select a unit (pcs or ctn).'); return; }

    const balance = getBalance(model.toUpperCase(), entries, exits);
    if (qty > balance) {
      showToast(`⚠ Quantity exceeds available stock (${balance}). Please check.`);
      return;
    }

    setSession(prev => [...prev, {
      model: model.toUpperCase(),
      date:  form.date,
      qty,
      unit:  form.unit,
      supplier: form.supplier.trim(),
      location: form.location.trim(),
    }]);
    setForm(prev => ({ ...prev, model: '', qty: '', unit: '', supplier: '', location: '' }));
  }

  function handleRemove(index) {
    setSession(prev => prev.filter((_, i) => i !== index));
  }

  function handleSaveAll() {
    if (session.length === 0) { showToast('Nothing to save. Add exits first.'); return; }
    addExits(session);
    const count = session.length;
    setSession([]);
    handleClear();
    showToast(`✓ ${count} exit ${count === 1 ? 'record' : 'records'} saved successfully.`);
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Exit</h1>
          <p className="page-sub">Record goods leaving inventory</p>
        </div>
      </div>

      <div className="exit-layout">
        {/* ---- FORM ---- */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">New Exit</span>
            <Badge variant="red">Exit</Badge>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label" htmlFor="exit-model">Model Number</label>
              <input
                id="exit-model"
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="e.g. MDL-10042-A"
                autoComplete="off"
              />
              {lookup && (
                <div className="stock-lookup">
                  <div className="stock-lookup__label">
                    {lookup.found
                      ? <>Available: <strong>{lookup.balance} {lookup.unit}</strong></>
                      : 'Model not found in entries'}
                  </div>
                  {lookup.found && <StatusBadge status={lookup.status} />}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="exit-date">Exit Date</label>
              <input
                id="exit-date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
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
              {remainingHint && (
                <p className={`form-hint${remainingHint.overLimit ? ' form-hint--error' : ''}`}>
                  {remainingHint.overLimit
                    ? `⚠ Exceeds available stock by ${Math.abs(remainingHint.remaining)} ${remainingHint.unit}`
                    : `${remainingHint.remaining} ${remainingHint.unit} will remain after this exit`}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="exit-supplier">Supplier</label>
              <input
                id="exit-supplier"
                type="text"
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                placeholder="Name of supplier"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="exit-location">Location</label>
              <input
                id="exit-location"
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Storage location"
              />
            </div>

            <div className="btn-row">
              <button className="btn" onClick={handleClear}>Clear</button>
              <button className="btn btn-danger" onClick={handleAddToList}>− Add to exit list</button>
            </div>
          </div>
        </div>

        {/* ---- SESSION LIST ---- */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              Exit list — {session.length} {session.length === 1 ? 'entry' : 'entries'}
            </span>
            <button className="btn btn-primary btn-sm" onClick={handleSaveAll}>
              Save all exits
            </button>
          </div>
          <SessionList
            items={session}
            mode="exit"
            onRemove={handleRemove}
            entries={entries}
            exits={exits}
          />
        </div>
      </div>
    </div>
  );
}
