// src/pages/EntryByDate.jsx
import { useState, useMemo } from 'react';
import Badge from '../components/Badge';
import { groupByDate, fmtDate } from '../utils/inventory';
import '../styles/EntryByDate.css';

export default function EntryByDate({ entries }) {
  const [search, setSearch]         = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const dateMap = useMemo(() => groupByDate(entries), [entries]);

  const sortedDates = useMemo(() => {
    return Object.keys(dateMap)
      .sort((a, b) => b.localeCompare(a))
      .filter(d =>
        !search ||
        d.includes(search) ||
        fmtDate(d).toLowerCase().includes(search.toLowerCase())
      );
  }, [dateMap, search]);

  const detailItems = selectedDate ? (dateMap[selectedDate] || []) : [];

  const detailTotals = useMemo(() => {
    const pcs = detailItems.filter(e => e.unit === 'pcs').reduce((s, e) => s + e.qty, 0);
    const ctn = detailItems.filter(e => e.unit === 'ctn').reduce((s, e) => s + e.qty, 0);
    return { pcs, ctn };
  }, [detailItems]);

  if (selectedDate) {
    return (
      <div className="page-content">
        <div className="back-row">
          <button className="back-btn" onClick={() => setSelectedDate(null)}>← Back</button>
          <span className="breadcrumb">
            Entry by Date &rsaquo; <strong>{fmtDate(selectedDate)}</strong>
          </span>
        </div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Stocks for {fmtDate(selectedDate)}</h1>
            <p className="page-sub">All stock entries recorded on this date</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">
              {detailItems.length} stock {detailItems.length === 1 ? 'entry' : 'entries'}
            </span>
            <span className="mono">{selectedDate}</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Model No.</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {detailItems.map((item, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--text3)' }}>{i + 1}</td>
                    <td><span className="mono">{item.model}</span></td>
                    <td style={{ fontWeight: 600 }}>{item.qty}</td>
                    <td>
                      <Badge variant={item.unit === 'pcs' ? 'blue' : 'neutral'}>
                        {item.unit}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="detail-footer">
            {detailTotals.pcs > 0 && (
              <span className="detail-footer__item">
                Total pcs: <strong>{detailTotals.pcs}</strong>
              </span>
            )}
            {detailTotals.ctn > 0 && (
              <span className="detail-footer__item">
                Total ctn: <strong>{detailTotals.ctn}</strong>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Entry by Date</h1>
          <p className="page-sub">All stock records grouped by entry date</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All dates on record</span>
          <input
            type="text"
            placeholder="Search date..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 180, fontSize: 13, padding: '6px 10px' }}
          />
        </div>

        {sortedDates.length === 0 ? (
          <div className="empty">
            No entries saved yet. Go to Stock Entry to add records.
          </div>
        ) : (
          <div className="date-list">
            <div className="date-list__header">
              <span>Date ID</span>
              <span>Entries</span>
              <span>Total Qty</span>
              <span />
            </div>
            {sortedDates.map(date => {
              const items = dateMap[date];
              const totalQty = items.reduce((s, e) => s + e.qty, 0);
              const unit = items[0].unit;
              return (
                <div
                  key={date}
                  className="date-row"
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="date-id">{date}</span>
                  <Badge variant="blue">
                    {items.length} item{items.length > 1 ? 's' : ''}
                  </Badge>
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>
                    {totalQty} {unit}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text3)' }}>View →</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
