import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { signIn, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const MAX_ATTEMPTS = 5;
  const LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if account is locked
    if (lockedUntil && Date.now() < lockedUntil) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000 / 60);
      return; // toast already showing via error state
    }

    try {
      await signIn(email, password);
      setAttempts(0);
      setLockedUntil(null);
      navigate("/");
    } catch (err) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCK_DURATION_MS);
      }
    }
  };

  const isLocked = lockedUntil && Date.now() < lockedUntil;
  const attemptsLeft = MAX_ATTEMPTS - attempts;

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
                disabled={isLocked}
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
                disabled={isLocked}
              />
            </div>

            {isLocked && (
              <div style={{ marginBottom: "16px", textAlign: "center" }}>
                <span className="badge badge-red" style={{ display: "inline-block", whiteSpace: "normal", padding: "6px 12px" }}>
                  🔒 Too many failed attempts. Try again in 5 minutes.
                </span>
              </div>
            )}

            {!isLocked && error && (
              <div style={{ marginBottom: "16px", textAlign: "center" }}>
                <span className="badge badge-red" style={{ display: "inline-block", whiteSpace: "normal", padding: "6px 12px" }}>
                  {error}
                  {attempts > 0 && attempts < MAX_ATTEMPTS && (
                    <span style={{ display: "block", fontSize: "11px", opacity: 0.85, marginTop: "4px" }}>
                      {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining before lockout
                    </span>
                  )}
                </span>
              </div>
            )}

            <div className="btn-row" style={{ paddingTop: "8px", borderTop: "none" }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "10px" }}
                disabled={loading || isLocked}
              >
                {loading ? "Authenticating..." : isLocked ? "Account Locked" : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
