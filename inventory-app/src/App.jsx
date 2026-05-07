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
import StockExited from './pages/StockExited';
import ProtectedRoute from './components/ProtectedRoute';

import { useAuth } from './hooks/useAuth';
import { useInventory } from './hooks/useInventory';
import { useToast }     from './hooks/useToast';
import { getAllModels, getBalance, getStatus } from './utils/inventory';

export default function App() {
  const { user } = useAuth();
  const { entries, exits, addEntries, addExits, loading } = useInventory(user);
  const { toast, showToast } = useToast();

  // Alert count for the nav badge — derived from live state
  const alertCount = useMemo(() => {
    const models = getAllModels(entries, exits);
    return models.filter(m => getStatus(getBalance(m, entries, exits)) !== 'ok').length;
  }, [entries, exits]);

  const pageProps = { entries, exits, showToast };

  if (user && loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'var(--text2)',
        fontFamily: 'var(--font-head)'
      }}>
        Syncing with Supabase...
      </div>
    );
  }

  return (
    <>
      {user && <NavBar alertCount={alertCount} />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/balance" replace />} />
        <Route
          path="/stock-entry"
          element={
            <ProtectedRoute>
              <StockEntry {...pageProps} addEntries={addEntries} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-exit"
          element={
            <ProtectedRoute>
              <StockExit {...pageProps} addExits={addExits} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entry-by-date"
          element={
            <ProtectedRoute>
              <EntryByDate entries={entries} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/balance"
          element={
            <ProtectedRoute>
              <StockBalance entries={entries} exits={exits} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-exited"
          element={
            <ProtectedRoute>
              <StockExited exits={exits} />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
