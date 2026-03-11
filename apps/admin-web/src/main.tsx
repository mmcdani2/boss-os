import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./index.css";

const API_BASE = "http://localhost:4000";
const TOKEN_KEY = "field_admin_token";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
};

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useMemo(() => getStoredToken(), [location.pathname]);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0" }}>
      <header style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Field Admin</div>

        <nav style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center" }}>
          <Link to="/login" style={{ color: "#93c5fd" }}>Login</Link>
          <Link to="/dashboard" style={{ color: "#93c5fd" }}>Dashboard</Link>
          <Link to="/logs" style={{ color: "#93c5fd" }}>Logs</Link>

          {token ? (
            <button
              onClick={() => {
                clearStoredToken();
                navigate("/login");
              }}
              style={{
                marginLeft: "auto",
                background: "#7f1d1d",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          ) : null}
        </nav>
      </header>

      <main style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>{children}</main>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = getStoredToken();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex@laurelstreetcreative.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = getStoredToken();

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as LoginResponse | { error?: string };

      if (!res.ok) {
        setError("error" in data ? data.error || "Login failed." : "Login failed.");
        return;
      }

      const loginData = data as LoginResponse;
      setStoredToken(loginData.token);
      navigate("/dashboard");
    } catch {
      setError("Could not reach API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h1 style={{ marginBottom: 16 }}>Admin Login</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 12,
          maxWidth: 420,
          background: "#111827",
          padding: 20,
          borderRadius: 12,
          border: "1px solid #1f2937",
        }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #334155" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #334155" }}
          />
        </label>

        {error ? <div style={{ color: "#fca5a5" }}>{error}</div> : null}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 14px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </Layout>
  );
}

function DashboardPage() {
  return (
    <RequireAuth>
      <Layout>
        <h1>Dashboard</h1>
        <p>Admin dashboard is live.</p>
        <p>Next step is pulling real log counts and recent history.</p>
      </Layout>
    </RequireAuth>
  );
}

function LogsPage() {
  return (
    <RequireAuth>
      <Layout>
        <h1>Logs</h1>
        <p>Logs page shell is live.</p>
        <p>Next step is loading /api/refrigerant-logs/admin/all.</p>
      </Layout>
    </RequireAuth>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);