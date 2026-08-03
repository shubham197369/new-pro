import { useState } from "react";

function Home({ onStartInterview }) {
  const [selectedCategory, setSelectedCategory] = useState("HR");

  // Read localStorage directly on initial state setup (Zero effect warnings)
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("interview_history") || "[]");
    } catch {
      return [];
    }
  });

  const categories = [
    { id: "HR", name: "HR & Behavioral", icon: "💼", desc: "Test soft skills, cultural fit, and leadership qualities." },
    { id: "Aptitude", name: "Aptitude & Reasoning", icon: "📐", desc: "Solve logical puzzles, quantitative & analytical problems." },
    { id: "Technical", name: "Full Stack / Tech", icon: "💻", desc: "Core coding concepts, system design, and algorithms." }
  ];

  const handleStart = (catId) => {
    const domainToStart = catId || selectedCategory;
    if (onStartInterview) {
      onStartInterview(domainToStart);
    }
  };

  return (
    <div className="home-container" style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Hero Section */}
      <section style={{ textAlign: "center", marginBottom: "60px" }}>
        <span style={{ 
          background: "#e0e7ff", 
          color: "#4f46e5", 
          padding: "6px 16px", 
          borderRadius: "20px", 
          fontSize: "14px", 
          fontWeight: "600" 
        }}>
          ✨ Next-Gen AI Interview Prep
        </span>
        
        <h1 style={{ fontSize: "2.8rem", margin: "20px 0 10px", color: "#fff" }}>
          Master Your Next Interview with <span style={{ color: "#4f46e5" }}>AI Coaching</span>
        </h1>
        
        <p style={{ fontSize: "1.2rem", color: "#94a3b8", maxWidth: "650px", margin: "0 auto 30px" }}>
          Practice domain-specific questions, receive instant behavioral feedback, and boost your confidence before the big day.
        </p>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button 
            onClick={() => handleStart(selectedCategory)}
            style={{
              padding: "14px 28px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
              backgroundColor: "#4f46e5",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
            }}
          >
            🚀 Start Instant Practice
          </button>
        </div>
      </section>

      {/* Category Selection */}
      <section style={{ marginBottom: "60px" }}>
        <h2 style={{ fontSize: "1.8rem", color: "#fff", textAlign: "center", marginBottom: "30px" }}>
          Select Practice Domain
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                border: selectedCategory === cat.id ? "2px solid #4f46e5" : "1px solid #334155",
                backgroundColor: selectedCategory === cat.id ? "#1e293b" : "#0f172a",
                padding: "24px",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{cat.icon}</div>
              <h3 style={{ margin: "0 0 8px", color: "#fff" }}>{cat.name}</h3>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px", lineHeight: "1.5" }}>{cat.desc}</p>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStart(cat.id);
                }}
                style={{
                  marginTop: "16px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  borderRadius: "6px",
                  border: "1px solid #4f46e5",
                  background: selectedCategory === cat.id ? "#4f46e5" : "transparent",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Start Test →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Local History Section */}
      {history.length > 0 && (
        <section style={{ background: "#1e293b", padding: "30px", borderRadius: "12px", border: "1px solid #334155" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, color: "#fff" }}>📊 Recent Practice History</h3>
            <button 
              onClick={() => {
                localStorage.removeItem("interview_history");
                setHistory([]);
              }}
              style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px" }}
            >
              Clear History
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {history.slice(-3).reverse().map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  background: "#0f172a", 
                  padding: "12px 20px", 
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  color: "#fff" 
                }}
              >
                <span><b>Score:</b> {item.score}%</span>
                <span style={{ color: "#94a3b8" }}>{item.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;