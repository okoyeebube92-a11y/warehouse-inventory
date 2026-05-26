import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { signIn, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signIn(email, password);
      console.log("LOGIN SUCCESS:", result);
    } catch (err) {
      console.log("LOGIN FAILED");
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "100px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
