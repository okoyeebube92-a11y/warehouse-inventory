// src/hooks/useInventory.js
// Central state hook. Swap localStorage calls for API calls here
// when connecting to Supabase or a Node.js backend.

import { useState, useCallback } from 'react';

const STORAGE_KEYS = {
  entries: 'inv_entries',
  exits:   'inv_exits',
};

function loadFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useInventory() {
  const [entries, setEntries] = useState(() => loadFromStorage(STORAGE_KEYS.entries));
  const [exits,   setExits]   = useState(() => loadFromStorage(STORAGE_KEYS.exits));

  // ---------- ENTRIES ----------
  const addEntries = useCallback((newItems) => {
    setEntries(prev => {
      const updated = [...prev, ...newItems];
      saveToStorage(STORAGE_KEYS.entries, updated);
      return updated;
    });
  }, []);

  // ---------- EXITS ----------
  const addExits = useCallback((newItems) => {
    setExits(prev => {
      const updated = [...prev, ...newItems];
      saveToStorage(STORAGE_KEYS.exits, updated);
      return updated;
    });
  }, []);

  return { entries, exits, addEntries, addExits };
}
