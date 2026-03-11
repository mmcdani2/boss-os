import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { API_BASE, getStoredToken } from "../lib/auth";

export default function LogDetailPage() {
    const { id } = useParams();
    const [log, setLog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadLog() {
            try {
                setLoading(true);
                setError("");

                const token = getStoredToken();

                const res = await fetch(`${API_BASE}/api/refrigerant-logs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data?.error || "Failed to load log.");
                    return;
                }

                setLog(data.log);
            } catch {
                setError("Could not reach API.");
            } finally {
                setLoading(false);
            }
        }

        if (id) loadLog();
    }, [id]);

    return (
        <Layout>
            <h1>Log Detail</h1>

            {loading ? <p>Loading log...</p> : null}
            {error ? <p style={{ color: "#fca5a5" }}>{error}</p> : null}

            {!loading && !error && log ? (
                <div
                    style={{
                        background: "#111827",
                        border: "1px solid #1f2937",
                        borderRadius: 12,
                        padding: 16,
                        display: "grid",
                        gap: 8,
                    }}
                >
                    <div><strong>ID:</strong> {log.id}</div>
                    <div><strong>Customer:</strong> {log.customerName || "N/A"}</div>
                    <div><strong>Tech:</strong> {log.techNameSnapshot}</div>
                    <div><strong>Company:</strong> {log.companyKey}</div>
                    <div><strong>Job Number:</strong> {log.jobNumber || "N/A"}</div>
                    <div><strong>Location:</strong> {log.city || "N/A"}, {log.state || ""}</div>
                    <div><strong>Equipment:</strong> {log.equipmentType || "N/A"}</div>
                    <div><strong>Refrigerant:</strong> {log.refrigerantType}</div>
                    <div><strong>Pounds Added:</strong> {log.poundsAdded ?? "0"}</div>
                    <div><strong>Pounds Recovered:</strong> {log.poundsRecovered ?? "0"}</div>
                    <div><strong>Leak Suspected:</strong> {log.leakSuspected ? "Yes" : "No"}</div>
                    <div><strong>Notes:</strong> {log.notes || "N/A"}</div>
                    <div><strong>Submitted:</strong> {log.submittedAt}</div>
                </div>
            ) : null}
        </Layout>
    );
}