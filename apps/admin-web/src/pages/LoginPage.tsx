import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { API_BASE, getStoredToken, setStoredToken, type LoginResponse } from "../lib/auth";

export default function LoginPage() {
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