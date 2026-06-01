// src/hooks/useInventory.js
// Central state hook. Swap localStorage calls for API calls here
// when connecting to Supabase or a Node.js backend.

import { useState, useCallback } from 'react';

const STORAGE_KEYS = {
  entries: 'inv_entries',
  exits:   'inv_exits',
  adminPin: 'inv_admin_pin',
};


function loadFromStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Ensure all records have a unique id
function ensureIds(arr) {
  return arr.map(item => ({
    ...item,
    id: item.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)),
  }));
}
  // Load and ensure IDs for all records
  const [entries, setEntries] = useState(() => {
    const loaded = loadFromStorage(STORAGE_KEYS.entries);
    const withIds = ensureIds(loaded);
    if (withIds.length !== loaded.length) saveToStorage(STORAGE_KEYS.entries, withIds);
    return withIds;
  });
  const [exits, setExits] = useState(() => {
    const loaded = loadFromStorage(STORAGE_KEYS.exits);
    const withIds = ensureIds(loaded);
    if (withIds.length !== loaded.length) saveToStorage(STORAGE_KEYS.exits, withIds);
    return withIds;
  });

  // Admin PIN state
  const [adminPin, setAdminPinState] = useState(() => loadFromStorage(STORAGE_KEYS.adminPin, ''));
  const setAdminPin = useCallback((pin) => {
    setAdminPinState(pin);
    saveToStorage(STORAGE_KEYS.adminPin, pin);
  }, []);

  // ---------- ENTRIES ----------
  const addEntries = useCallback((newItems) => {
    setEntries(prev => {
      const withIds = ensureIds(newItems);
      const updated = [...prev, ...withIds];
      saveToStorage(STORAGE_KEYS.entries, updated);
      return updated;
    });
  }, []);

  const updateEntry = useCallback((id, data) => {
    setEntries(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, ...data } : e);
      saveToStorage(STORAGE_KEYS.entries, updated);
      return updated;
    });
  }, []);

  const deleteEntry = useCallback((id) => {
    setEntries(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveToStorage(STORAGE_KEYS.entries, updated);
      return updated;
    });
  }, []);

  // ---------- EXITS ----------
  const addExits = useCallback((newItems) => {
    setExits(prev => {
      const withIds = ensureIds(newItems);
      const updated = [...prev, ...withIds];
      saveToStorage(STORAGE_KEYS.exits, updated);
      return updated;
    });
  }, []);

  const updateExit = useCallback((id, data) => {
    setExits(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, ...data } : e);
      saveToStorage(STORAGE_KEYS.exits, updated);
      return updated;
    });
  }, []);

  const deleteExit = useCallback((id) => {
    setExits(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveToStorage(STORAGE_KEYS.exits, updated);
      return updated;
    });
  }, []);

  return {
    entries,
    exits,
    addEntries,
    addExits,
    updateEntry,
    updateExit,
    deleteEntry,
    deleteExit,
    adminPin,
    setAdminPin,
  };
}
