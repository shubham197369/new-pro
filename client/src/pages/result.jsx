function Result({ data, onRestart }) {
  const score = data?.score || 6;
  const domain = data?.domain || "HR & Behavioral";
  const answers = data?.answers || {
    0: "Tell me about yourself response...",
    1: "Strengths response...",
  };

  const sampleQuestions = [
    "Q1: Tell me about yourself.",
    "Q2: Why should we hire you?",
    "Q3: What are your strengths?",
    "Q4: What is your biggest weakness?"
  ];

  return (
    <div style={{ 
      minHeight: "100vh", 
      width: "100%", 
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", 
      padding: "40px 20px", 
      boxSizing: "border-box",
      color: "#f8fafc"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* TOP HEADER */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ background: "rgba(99, 102, 241, 0.2)", color: "#818cf8", border: "1px solid #6366f1", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" }}>
            EVALUATION REPORT • {domain.toUpperCase()}
          </span>
          <h1 style={{ fontSize: "36px", margin: "16px 0 8px", background: "linear-gradient(to right, #ffffff, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI Interview Insights
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "15px" }}>Here is a detailed analysis of your performance and answers.</p>
        </div>

        {/* OVERALL PERFORMANCE CARD */}
        <div style={{ background: "rgba(30, 41, 59, 0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "30px", marginBottom: "30px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "22px" }}>Overall Performance Score</h2>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>Evaluation completed based on clarity and structure.</p>
            </div>
            
            <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", padding: "16px 28px", borderRadius: "16px", textAlign: "center", boxShadow: "0 8px 20px rgba(79, 70, 229, 0.4)" }}>
              <span style={{ fontSize: "32px", fontWeight: "bold", color: "#fff" }}>{score}</span>
              <span style={{ fontSize: "18px", color: "#c7d2fe" }}> / 100</span>
              <p style={{ margin: 0, fontSize: "11px", color: "#e0e7ff", textTransform: "uppercase", letterSpacing: "1px" }}>Score</p>
            </div>
          </div>

          {/* STRENGTHS & IMPROVEMENTS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "30px" }}>
            <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "12px", padding: "20px" }}>
              <h4 style={{ margin: "0 0 8px", color: "#4ade80", display: "flex", alignItems: "center", gap: "8px" }}>
                ✅ Key Strengths
              </h4>
              <p style={{ margin: 0, color: "#cbd5e1", fontSize: "14px", lineHeight: "1.5" }}>Completed all required questions with consistent response attempts.</p>
            </div>

            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "12px", padding: "20px" }}>
              <h4 style={{ margin: "0 0 8px", color: "#f87171", display: "flex", alignItems: "center", gap: "8px" }}>
                💡 Scope for Improvement
              </h4>
              <p style={{ margin: 0, color: "#cbd5e1", fontSize: "14px", lineHeight: "1.5" }}>Elaborate your answers using the STAR method (Situation, Task, Action, Result).</p>
            </div>
          </div>
        </div>

        {/* TRANSCRIPTS SECTION */}
        <h3 style={{ fontSize: "20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          📝 Transcripts & Responses
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
          {sampleQuestions.map((q, idx) => (
            <div key={idx} style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid #334155", borderRadius: "14px", padding: "20px" }}>
              <h4 style={{ margin: "0 0 10px", color: "#818cf8", fontSize: "16px" }}>{q}</h4>
              <div style={{ background: "#0f172a", padding: "12px 16px", borderRadius: "8px", borderLeft: "4px solid #6366f1", color: "#e2e8f0", fontSize: "14px" }}>
                <b>Answer:</b> {answers[idx] || "No response provided."}
              </div>
            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ textAlign: "center", display: "flex", gap: "15px", justifyContent: "center" }}>
          <button 
            onClick={onRestart}
            style={{ background: "#4f46e5", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "10px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 15px rgba(79, 70, 229, 0.4)" }}
          >
            🔄 Take Another Interview
          </button>
        </div>

      </div>
    </div>
  );
}

export default Result;