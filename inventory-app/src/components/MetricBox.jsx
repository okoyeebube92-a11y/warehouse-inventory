// src/components/MetricBox.jsx
import '../styles/MetricBox.css';  
export default function MetricBox({ label, value, sub, valueStyle }) {
  return (
    <div className="metric-box">
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={valueStyle}>{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}
