import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useInventory(user) {
  const [entries, setEntries] = useState([]);
  const [exits, setExits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: entriesData, error: entriesError } = await supabase
        .from('stock_entries')
        .select('*')
        .order('date', { ascending: false });

      const { data: exitsData, error: exitsError } = await supabase
        .from('stock_exits')
        .select('*')
        .order('date', { ascending: false });

      if (entriesError) throw entriesError;
      if (exitsError) throw exitsError;

      setEntries(entriesData || []);
      setExits(exitsData || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setEntries([]);
      setExits([]);
      setLoading(false);
    }
  }, [fetchData, user]);

  // ---------- ENTRIES ----------
  const addEntries = useCallback(async (newItems) => {
    try {
      const { data, error } = await supabase
        .from('stock_entries')
        .insert(newItems)
        .select();

      if (error) throw error;
      setEntries(prev => [...(data || []), ...prev]);
      return data;
    } catch (error) {
      console.error("Error adding entries:", error);
      throw error;
    }
  }, []);

  // ---------- EXITS ----------
  const addExits = useCallback(async (newItems) => {
    try {
      const { data, error } = await supabase
        .from('stock_exits')
        .insert(newItems)
        .select();

      if (error) throw error;
      setExits(prev => [...(data || []), ...prev]);
      return data;
    } catch (error) {
      console.error("Error adding exits:", error);
      throw error;
    }
  }, []);

  return { entries, exits, loading, addEntries, addExits, refresh: fetchData };
}

