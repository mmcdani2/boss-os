import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearStoredToken, getStoredToken } from "../lib/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
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