// src/utils/inventory.js
// Pure utility functions — no React, no side effects.
// Easy to swap out when connecting to a backend.

export const LOW_THRESHOLD = 20;

/**
 * Format an ISO date string (YYYY-MM-DD) to "Mon DD, YYYY"
 */
export function fmtDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(day, 10)}, ${y}`;
}

/**
 * Return today's date as YYYY-MM-DD
 */
export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calculate the balance for a single model from full entry/exit arrays.
 */
export function getBalance(model, entries, exits) {
  const up = model.toUpperCase();
  const totalIn  = entries.filter(e => e.model === up).reduce((s, e) => s + e.qty, 0);
  const totalOut = exits.filter(e => e.model === up).reduce((s, e) => s + e.qty, 0);
  return totalIn - totalOut;
}

/**
 * Get the unit for a model (from whichever record we find first).
 */
export function getUnit(model, entries, exits) {
  const up = model.toUpperCase();
  const found = [...entries, ...exits].find(e => e.model === up);
  return found ? found.unit : '—';
}

/**
 * Return all unique model names (uppercased) across entries and exits.
 */
export function getAllModels(entries, exits) {
  const set = new Set([...entries, ...exits].map(e => e.model.toUpperCase()));
  return [...set];
}

/**
 * Determine stock status from a balance number.
 * Returns: 'ok' | 'low' | 'none'
 */
export function getStatus(balance) {
  if (balance <= 0)            return 'none';
  if (balance <= LOW_THRESHOLD) return 'low';
  return 'ok';
}

/**
 * Group entries by date. Returns { 'YYYY-MM-DD': [entry, ...] }
 */
export function groupByDate(entries) {
  return entries.reduce((map, entry) => {
    if (!map[entry.date]) map[entry.date] = [];
    map[entry.date].push(entry);
    return map;
  }, {});
}

/**
 * Build the balance row data for every model.
 * Useful for the Stock Balance page.
 */
export function buildBalanceRows(entries, exits) {
  const models = getAllModels(entries, exits);
  return models.map(model => {
    const bal      = getBalance(model, entries, exits);
    const totalIn  = entries.filter(e => e.model === model).reduce((s, e) => s + e.qty, 0);
    const totalOut = exits.filter(e => e.model === model).reduce((s, e) => s + e.qty, 0);
    const unit     = getUnit(model, entries, exits);
    const lastEntry = entries
      .filter(e => e.model === model)
      .map(e => e.date)
      .sort()
      .reverse()[0] || null;
    const status = getStatus(bal);
    return { model, bal, totalIn, totalOut, unit, lastEntry, status };
  });
}
