import { useState } from "react";
import { login } from "../api/authApi";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    user,
    loading,
    error
  };
}