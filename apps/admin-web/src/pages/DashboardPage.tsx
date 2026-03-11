import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { API_BASE, getStoredToken } from "../lib/auth";

export default function DashboardPage() {
    const [stats, setStats] = useState<{
        totalLogs: number;
        logsToday: number;
        activeTechs: number;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadStats() {
            try {
                setLoading(true);
                setError("");

                const token = getStoredToken();

                const res = await fetch(`${API_BASE}/api/refrigerant-logs/admin/stats/summary`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data?.error || "Failed to load dashboard stats.");
                    return;
                }

                setStats(data);
            } catch {
                setError("Could not reach API.");
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    return (
        <Layout>
            <h1>Dashboard</h1>

            {loading ? <p>Loading dashboard...</p> : null}
            {error ? <p style={{ color: "#fca5a5" }}>{error}</p> : null}

            {!loading && !error && stats ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 16,
                        marginTop: 16,
                    }}
                >
                    <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 14, color: "#94a3b8" }}>Total Logs</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.totalLogs}</div>
                    </div>

                    <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 14, color: "#94a3b8" }}>Logs Today</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.logsToday}</div>
                    </div>

                    <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 14, color: "#94a3b8" }}>Active Techs</div>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.activeTechs}</div>
                    </div>
                </div>
            ) : null}
        </Layout>
    );
}