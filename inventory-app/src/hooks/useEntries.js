import { useState } from "react";
import { createEntries } from "../api/entriesApi";

export function useEntries() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const addEntries = async (entries) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createEntries(entries);
      setData(result.data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addEntries,
    data,
    loading,
    error
  };
}