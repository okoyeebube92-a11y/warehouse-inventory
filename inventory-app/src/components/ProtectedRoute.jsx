import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, globalLoading } = useAuth();

  if (globalLoading) {
    return (
      <div style={{
        padding: "40px",
        textAlign: "center",
        color: "var(--text2)",
        fontFamily: "var(--font-head)"
      }}>
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
