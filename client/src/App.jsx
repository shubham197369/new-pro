import { useState } from "react";
import Home from "./pages/home";
import Interview from "./pages/interview";
import Result from "./pages/result";
import Dashboard from "./pages/Dashboard";
import Footer from "./pages/Footer";

function App() {
  const [currentPage, setCurrentPage] = useState("home"); // 'home', 'interview', 'result', 'dashboard'
  const [selectedDomain, setSelectedDomain] = useState("HR & Behavioral");
  const [evaluationData, setEvaluationData] = useState(null);
  
  // User & Auth State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("app_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isPro, setIsPro] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  // Form Inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const startInterview = (domain) => {
    setSelectedDomain(domain || "HR & Behavioral");
    setCurrentPage("interview");
  };

  const finishInterview = (data) => {
    setEvaluationData(data);
    
    // Save to History (Local Fallback)
    const historyItem = {
      domain: selectedDomain || "General",
      title: `${(selectedDomain || "General").charAt(0).toUpperCase() + (selectedDomain || "General").slice(1)} Practice`,
      score: data?.score || 85,
      date: new Date().toLocaleDateString()
    };

    const existing = JSON.parse(localStorage.getItem("interview_history") || "[]");
    localStorage.setItem("interview_history", JSON.stringify([historyItem, ...existing]));

    setCurrentPage("result");
  };

  // Auth Functions (Login / Signup Backend Call)
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
    const body = isSignup ? { name, email, password } : { email, password };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || "Something went wrong!");
        return;
      }

      // Save user to state and localStorage
      setUser(data.user);
      setIsPro(data.user.isPro || false);
      localStorage.setItem("app_user", JSON.stringify(data.user));
      setShowAuthModal(false);
      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setAuthError("Server is unreachable. Make sure backend is running!");
    }
  };


  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("app_user");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "sans-serif" }}>
      {/* TOP NAVBAR */}
      <nav style={{ background: "#1e293b", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155" }}>
        <h2 
          onClick={() => setCurrentPage("home")} 
          style={{ color: "#fff", margin: 0, cursor: "pointer", fontSize: "20px" }}
        >
          🤖 AI Interviewer
        </h2>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <button 
            onClick={() => setCurrentPage("home")}
            style={{ background: "none", border: "none", color: currentPage === "home" ? "#818cf8" : "#94a3b8", cursor: "pointer", fontWeight: "bold" }}
          >
            Home
          </button>
          
          <button 
            onClick={() => setCurrentPage("dashboard")}
            style={{ background: "none", border: "none", color: currentPage === "dashboard" ? "#818cf8" : "#94a3b8", cursor: "pointer", fontWeight: "bold" }}
          >
            Dashboard
          </button>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#22c55e", fontWeight: "bold", fontSize: "14px" }}>
                👤 {user.name}
              </span>
              <button
                onClick={handleLogout}
                style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              style={{ background: "#4f46e5", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}
            >
              Sign In / Register
            </button>
          )}
        </div>
      </nav>

      {/* LOGIN / SIGNUP MODAL */}
      {showAuthModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#1e293b", padding: "30px", borderRadius: "12px", width: "350px", border: "1px solid #334155", color: "#fff" }}>
            <h2 style={{ textAlign: "center", marginTop: 0 }}>
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>

            {authError && (
              <p style={{ background: "#ef444422", color: "#ef4444", padding: "8px", borderRadius: "6px", fontSize: "13px", textAlign: "center" }}>
                {authError}
              </p>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {isSignup && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" }}
              />

              <button
                type="submit"
                style={{ background: "#4f46e5", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
              >
                {isSignup ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#94a3b8", marginTop: "15px" }}>
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                onClick={() => { setIsSignup(!isSignup); setAuthError(""); }}
                style={{ color: "#818cf8", cursor: "pointer", fontWeight: "bold" }}
              >
                {isSignup ? "Sign In" : "Register"}
              </span>
            </p>

            <button
              onClick={() => setShowAuthModal(false)}
              style={{ width: "100%", background: "transparent", border: "none", color: "#64748b", cursor: "pointer", marginTop: "10px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC PAGE ROUTING */}
      {currentPage === "home" && (
        <Home onStartInterview={startInterview} isPro={isPro} />
      )}

      {currentPage === "interview" && (
        <Interview domain={selectedDomain} onFinish={finishInterview} />
      )}

      {currentPage === "result" && (
        <Result data={evaluationData} onRestart={() => setCurrentPage("home")} />
      )}

      {currentPage === "dashboard" && (
        <Dashboard user={user} isPro={isPro} onStartNewTest={() => setCurrentPage("home")} />
      )}

      {/* FOOTER */}
      <Footer isPro={isPro} setIsPro={setIsPro} user={user} setUser={setUser} />
    </div>
  );
}

export default App;