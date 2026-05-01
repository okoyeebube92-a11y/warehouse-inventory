// src/pages/StockBalance.jsx
import { useState, useMemo } from 'react';
import MetricBox from '../components/MetricBox';
import StatusBadge from '../components/StatusBadge';
import { buildBalanceRows, fmtDate } from '../utils/inventory';
import '../styles/StockBalance.css';

const FILTER_MAP = {
  all:  { label: 'All',      cls: 'active-all'   },
  ok:   { label: 'In Stock', cls: 'active-green'  },
  low:  { label: 'Low Stock',cls: 'active-amber'  },
  none: { label: 'No Stock', cls: 'active-red'    },
};

export default function StockBalance({ entries, exits }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const allRows = useMemo(() => buildBalanceRows(entries, exits), [entries, exits]);

  const filteredRows = useMemo(() => {
    return allRows
      .filter(r => filter === 'all' || r.status === filter)
      .filter(r => !search || r.model.includes(search.toUpperCase()))
      .sort((a, b) => {
        const order = { none: 0, low: 1, ok: 2 };
        return order[a.status] - order[b.status];
      });
  }, [allRows, filter, search]);

  const totalIn  = entries.reduce((s, e) => s + e.qty, 0);
  const totalOut = exits.reduce((s, e) => s + e.qty, 0);
  const lowCount  = allRows.filter(r => r.status === 'low').length;
  const noneCount = allRows.filter(r => r.status === 'none').length;
  const alertCount = lowCount + noneCount;

  const noStockModels  = allRows.filter(r => r.status === 'none');
  const lowStockModels = allRows.filter(r => r.status === 'low');

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Balance</h1>
          <p className="page-sub">Live summary — all entries, exits and current balance</p>
        </div>
      </div>

      {/* METRICS */}
      <div className="metrics">
        <MetricBox label="Total models"  value={allRows.length}  sub="unique SKUs" />
        <MetricBox label="Total entered" value={totalIn}  sub="units received"  valueStyle={{ color: 'var(--green)' }} />
        <MetricBox label="Total exited"  value={totalOut} sub="units removed"   valueStyle={{ color: 'var(--red)' }} />
        <MetricBox
          label="Alerts"
          value={alertCount}
          sub={`${lowCount} low · ${noneCount} empty`}
          valueStyle={{ color: 'var(--amber)' }}
        />
      </div>

      <div className="card">
        {/* ALERT CARDS */}
        {alertCount > 0 && (
          <div className="alert-cards">
            {noStockModels.length > 0 && (
              <div className="alert-card alert-card--red">
                <div className="alert-card__title">
                  No stock — {noStockModels.length} item{noStockModels.length > 1 ? 's' : ''}
                </div>
                {noStockModels.map(r => (
                  <div className="alert-item" key={r.model}>
                    {r.model} <span>· 0 {r.unit}</span>
                  </div>
                ))}
              </div>
            )}
            {lowStockModels.length > 0 && (
              <div className="alert-card alert-card--amber">
                <div className="alert-card__title">
                  Low stock — {lowStockModels.length} item{lowStockModels.length > 1 ? 's' : ''}
                </div>
                {lowStockModels.map(r => (
                  <div className="alert-item" key={r.model}>
                    {r.model} <span>· {r.bal} {r.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TOOLBAR */}
        <div className="balance-toolbar">
          <div className="filter-pills">
            {Object.entries(FILTER_MAP).map(([key, { label, cls }]) => (
              <button
                key={key}
                className={`pill ${filter === key ? cls : ''}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search model no."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 200 }}
          />
        </div>

        {/* TABLE */}
        {filteredRows.length === 0 ? (
          <div className="empty">
            No stock records found. Add entries via Stock Entry.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Model No.</th>
                  <th>Last Entry Date</th>
                  <th>Total In</th>
                  <th>Total Out</th>
                  <th>Balance</th>
                  <th>Unit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map(row => {
                  const rowClass =
                    row.status === 'low'  ? 'row-low'  :
                    row.status === 'none' ? 'row-none' : '';
                  const balClass =
                    row.status === 'none' ? 'zero' :
                    row.status === 'low'  ? 'low'  : '';
                  return (
                    <tr key={row.model} className={rowClass}>
                      <td><span className="mono">{row.model}</span></td>
                      <td style={{ fontSize: 12, color: 'var(--text2)' }}>
                        {fmtDate(row.lastEntry)}
                      </td>
                      <td><span className="num-in">+{row.totalIn}</span></td>
                      <td><span className="num-out">−{row.totalOut}</span></td>
                      <td><span className={`num-bal ${balClass}`}>{row.bal}</span></td>
                      <td style={{ fontSize: 12, color: 'var(--text2)' }}>{row.unit}</td>
                      <td><StatusBadge status={row.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
