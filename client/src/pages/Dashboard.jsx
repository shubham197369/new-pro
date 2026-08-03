import { useState, useEffect } from "react";

function Dashboard({ user, isPro, onStartNewTest }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch past interviews from Backend MongoDB
  useEffect(() => {
    fetch("http://localhost:5000/api/interviews")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHistory(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load from backend, checking localStorage fallback:", err);
        try {
          const saved = localStorage.getItem("interview_history");
          setHistory(saved ? JSON.parse(saved) : []);
        } catch {
          setHistory([]);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", color: "#f8fafc" }}>
      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", background: "#1e293b", padding: "24px", borderRadius: "16px", border: "1px solid #334155" }}>
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: "28px" }}>
            Welcome back, {user ? user.name : "Guest"}! 👋
          </h1>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
            Track your interview performance and past AI feedbacks.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ background: isPro ? "#22c55e" : "#eab308", color: "#fff", padding: "6px 14px", borderRadius: "20px", fontWeight: "bold", fontSize: "12px", display: "inline-block", marginBottom: "10px" }}>
            {isPro ? "👑 PRO MEMBER" : "FREE PLAN"}
          </span>
          <br />
          <button 
            onClick={onStartNewTest}
            style={{ background: "#4f46e5", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
          >
            + Start New Interview
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "35px" }}>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155", textAlign: "center" }}>
          <p style={{ margin: "0 0 6px", color: "#94a3b8", fontSize: "13px" }}>Total Tests Attempted</p>
          <h2 style={{ margin: 0, fontSize: "32px", color: "#818cf8" }}>{history.length}</h2>
        </div>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155", textAlign: "center" }}>
          <p style={{ margin: "0 0 6px", color: "#94a3b8", fontSize: "13px" }}>Average Score</p>
          <h2 style={{ margin: 0, fontSize: "32px", color: "#22c55e" }}>
            {history.length > 0 
              ? Math.round(history.reduce((acc, curr) => acc + (curr.score || 0), 0) / history.length) + "%" 
              : "N/A"}
          </h2>
        </div>
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155", textAlign: "center" }}>
          <p style={{ margin: "0 0 6px", color: "#94a3b8", fontSize: "13px" }}>Account Type</p>
          <h2 style={{ margin: 0, fontSize: "28px", color: "#f59e0b" }}>{isPro ? "PRO" : "Free"}</h2>
        </div>
      </div>

      {/* PAST INTERVIEWS LIST */}
      <h2 style={{ margin: "0 0 18px", fontSize: "22px" }}>📜 Interview History</h2>

      {loading ? (
        <p style={{ color: "#94a3b8" }}>Loading history from MongoDB...</p>
      ) : history.length === 0 ? (
        <div style={{ background: "#1e293b", padding: "40px", borderRadius: "12px", textAlign: "center", border: "1px solid #334155" }}>
          <p style={{ color: "#94a3b8", margin: "0 0 15px" }}>You haven't completed any interviews yet.</p>
          <button 
            onClick={onStartNewTest}
            style={{ background: "#4f46e5", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
          >
            Take Your First Interview →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {history.map((item, index) => (
            <div key={item._id || index} style={{ background: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
              <div>
                <span style={{ background: "#334155", color: "#818cf8", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>
                  {item.domain || "General"}
                </span>
                <h3 style={{ margin: "8px 0 4px", fontSize: "18px" }}>{item.title || "Interview Practice Session"}</h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                  Completed on: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.date || "Recently")}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "24px", fontWeight: "bold", color: item.score >= 70 ? "#22c55e" : "#eab308" }}>
                    {item.score}%
                  </span>
                  <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>Overall Score</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;