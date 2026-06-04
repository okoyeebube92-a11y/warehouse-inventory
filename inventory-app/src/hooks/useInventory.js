import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useInventory(user) {
  const [entries, setEntries] = useState([]);
  const [exits, setExits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminPin, setAdminPinState] = useState(() => {
    return localStorage.getItem('inv_admin_pin') || '';
  });

  const setAdminPin = useCallback((pin) => {
    localStorage.setItem('inv_admin_pin', pin);
    setAdminPinState(pin);
  }, []);

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
      console.error("Error fetching inventory data:", error);
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
      const itemsWithUser = newItems.map(item => ({
        model: item.model,
        qty: item.qty,
        unit: item.unit,
        date: item.date,
        user_id: user?.id
      }));

      const { data, error } = await supabase
        .from('stock_entries')
        .insert(itemsWithUser)
        .select();

      if (error) throw error;
      setEntries(prev => [...(data || []), ...prev]);
      return data;
    } catch (error) {
      console.error("Error adding entries:", error);
      throw error;
    }
  }, [user]);

  const deleteEntry = useCallback(async (id) => {
    try {
      const { error } = await supabase
        .from('stock_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEntries(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
      throw error;
    }
  }, []);

  const updateEntry = useCallback(async (id, updatedFields) => {
    try {
      const { id: _, created_at: __, user_id: ___, ...fieldsToUpdate } = updatedFields;
      const { data, error } = await supabase
        .from('stock_entries')
        .update(fieldsToUpdate)
        .eq('id', id)
        .select();

      if (error) throw error;
      setEntries(prev => prev.map(item => item.id === id ? { ...item, ...data[0] } : item));
      return data;
    } catch (error) {
      console.error("Error updating entry:", error);
      throw error;
    }
  }, []);

  // ---------- EXITS ----------
  const addExits = useCallback(async (newItems) => {
    try {
      const itemsWithUser = newItems.map(item => ({
        model: item.model,
        qty: item.qty,
        unit: item.unit,
        date: item.date,
        supplier: item.supplier || null,
        location: item.location || null,
        user_id: user?.id
      }));

      const { data, error } = await supabase
        .from('stock_exits')
        .insert(itemsWithUser)
        .select();

      if (error) throw error;
      setExits(prev => [...(data || []), ...prev]);
      return data;
    } catch (error) {
      console.error("Error adding exits:", error);
      throw error;
    }
  }, [user]);

  const deleteExit = useCallback(async (id) => {
    try {
      const { error } = await supabase
        .from('stock_exits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setExits(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting exit:", error);
      throw error;
    }
  }, []);

  const updateExit = useCallback(async (id, updatedFields) => {
    try {
      const { id: _, created_at: __, user_id: ___, ...fieldsToUpdate } = updatedFields;
      const { data, error } = await supabase
        .from('stock_exits')
        .update(fieldsToUpdate)
        .eq('id', id)
        .select();

      if (error) throw error;
      setExits(prev => prev.map(item => item.id === id ? { ...item, ...data[0] } : item));
      return data;
    } catch (error) {
      console.error("Error updating exit:", error);
      throw error;
    }
  }, []);

  return { 
    entries, 
    exits, 
    loading, 
    addEntries, 
    deleteEntry, 
    updateEntry, 
    addExits, 
    deleteExit, 
    updateExit, 
    adminPin, 
    setAdminPin,
    refresh: fetchData 
  };
}
