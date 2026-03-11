import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { API_BASE, getStoredToken } from "../lib/auth";

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadLogs() {
            try {
                setLoading(true);
                setError("");

                const token = getStoredToken();

                const res = await fetch(`${API_BASE}/api/refrigerant-logs/admin/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data?.error || "Failed to load logs.");
                    return;
                }

                setLogs(data.logs || []);
            } catch {
                setError("Could not reach API.");
            } finally {
                setLoading(false);
            }
        }

        loadLogs();
    }, []);

    return (
        <Layout>
            <h1>Logs</h1>

            {loading ? <p>Loading logs...</p> : null}
            {error ? <p style={{ color: "#fca5a5" }}>{error}</p> : null}

            {!loading && !error ? (
                <div style={{ display: "grid", gap: 12 }}>
                    {logs.length === 0 ? (
                        <p>No logs found.</p>
                    ) : (
                        logs.map((log) => (
                            <Link
                                key={log.id}
                                to={`/logs/${log.id}`}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <div
                                    style={{
                                        background: "#111827",
                                        border: "1px solid #1f2937",
                                        borderRadius: 12,
                                        padding: 16,
                                        cursor: "pointer",
                                    }}
                                >
                                    <div style={{ fontWeight: 700 }}>
                                        {log.customerName || "No customer name"} — {log.refrigerantType}
                                    </div>
                                    <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 6 }}>
                                        Tech: {log.techNameSnapshot}
                                    </div>
                                    <div style={{ fontSize: 14, color: "#94a3b8" }}>
                                        Job: {log.jobNumber || "N/A"} | {log.city || "N/A"}, {log.state || ""}
                                    </div>
                                    <div style={{ fontSize: 14, color: "#94a3b8" }}>
                                        Added: {log.poundsAdded ?? "0"} | Recovered: {log.poundsRecovered ?? "0"}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            ) : null}
        </Layout>
    );
}