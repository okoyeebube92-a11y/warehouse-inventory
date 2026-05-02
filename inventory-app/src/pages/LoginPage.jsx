import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { signIn, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signIn(email, password);
      console.log("LOGIN SUCCESS:", result);
      navigate("/");
    } catch (err) {
      console.log("LOGIN FAILED");
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: "400px", marginTop: "60px" }}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title" style={{ fontSize: "18px" }}>Welcome Back</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{ marginBottom: "16px", textAlign: "center" }}>
                <span className="badge badge-red" style={{ display: "inline-block", whiteSpace: "normal", padding: "6px 12px" }}>
                  {error}
                </span>
              </div>
            )}

            <div className="btn-row" style={{ paddingTop: "8px", borderTop: "none" }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "10px" }}
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
