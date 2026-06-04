import { useState, useContext } from "react";
import { login } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const { user, loading: globalLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, password);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    globalLoading,
    loading,
    error,
    signIn,
    signOut
  };
}