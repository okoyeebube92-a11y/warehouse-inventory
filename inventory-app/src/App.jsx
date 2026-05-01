// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useMemo } from 'react';

import NavBar     from './components/NavBar';
import Toast      from './components/Toast';
import StockEntry  from './pages/StockEntry';
import StockExit   from './pages/StockExit';
import EntryByDate from './pages/EntryByDate';
import StockBalance from './pages/StockBalance';
import LoginPage from './pages/LoginPage';

import { useInventory } from './hooks/useInventory';
import { useToast }     from './hooks/useToast';
import { getAllModels, getBalance, getStatus } from './utils/inventory';

export default function App() {
  const { entries, exits, addEntries, addExits } = useInventory();
  const { toast, showToast } = useToast();

  // Alert count for the nav badge — derived from live state
  const alertCount = useMemo(() => {
    const models = getAllModels(entries, exits);
    return models.filter(m => getStatus(getBalance(m, entries, exits)) !== 'ok').length;
  }, [entries, exits]);

  const pageProps = { entries, exits, showToast };

  return (
    <>
      <NavBar alertCount={alertCount} />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/stock-entry" replace />} />
        <Route
          path="/stock-entry"
          element={<StockEntry {...pageProps} addEntries={addEntries} />}
        />
        <Route
          path="/stock-exit"
          element={<StockExit {...pageProps} addExits={addExits} />}
        />
        <Route
          path="/entry-by-date"
          element={<EntryByDate entries={entries} />}
        />
        <Route
          path="/balance"
          element={<StockBalance entries={entries} exits={exits} />}
        />
      </Routes>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
