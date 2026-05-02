import { useState, useMemo } from 'react';
import Badge from '../components/Badge';
import { fmtDate } from '../utils/inventory';

export default function StockExited({ exits }) {
  const [modelSearch, setModelSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');

  const filteredExits = useMemo(() => {
    return exits.filter(exit => {
      const matchesModel = !modelSearch || exit.model.toLowerCase().includes(modelSearch.toLowerCase());
      const matchesDate = !dateSearch || exit.date === dateSearch;
      return matchesModel && matchesDate;
    });
  }, [exits, modelSearch, dateSearch]);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Exited</h1>
          <p className="page-sub">Records of all stock exits from the warehouse</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '15px' }}>
          <div className="search-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 500 }}>Model No:</label>
            <input
              type="text"
              placeholder="Search model..."
              value={modelSearch}
              onChange={e => setModelSearch(e.target.value)}
              style={{ width: '160px', padding: '6px 10px', fontSize: '13px' }}
            />
          </div>
          <div className="search-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 500 }}>Exit Date:</label>
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

        {filteredExits.length === 0 ? (
          <div className="empty" style={{ padding: '60px', textAlign: 'center' }}>
            {exits.length === 0 
              ? "No exit records found. Go to Stock Exit to record items leaving the warehouse."
              : "No exit records match your search filters."}
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
                  <th>Supplier</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {filteredExits.map((item, i) => (
                  <tr key={item.id || i}>
                    <td className="mono" style={{ fontSize: '13px', color: 'var(--text2)' }}>
                      {fmtDate(item.date)}
                    </td>
                    <td>
                      <span className="mono" style={{ fontWeight: 600 }}>{item.model}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--danger)' }}>
                      −{item.qty}
                    </td>
                    <td>
                      <Badge variant={item.unit === 'pcs' ? 'blue' : 'neutral'}>
                        {item.unit}
                      </Badge>
                    </td>
                    <td style={{ color: 'var(--text2)', fontSize: '13px' }}>{item.supplier || '-'}</td>
                    <td style={{ color: 'var(--text2)', fontSize: '13px' }}>{item.location || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
