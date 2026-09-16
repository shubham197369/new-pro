import { useState, useEffect } from "react";

function Footer({ isPro, setIsPro, user, setUser }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [utrNumber, setUtrNumber] = useState("");

  // Payment Requests State
  const [paymentRequests, setPaymentRequests] = useState(() => {
    const saved = localStorage.getItem("payment_requests");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("payment_requests", JSON.stringify(paymentRequests));
  }, [paymentRequests]);

  // Check if current user has an approved payment
  useEffect(() => {
    if (user) {
      const userReq = paymentRequests.find((req) => req.email === user.email);
      if (userReq && userReq.status === "approved") {
        setIsPro(true);
      } else {
        setIsPro(false);
      }
    }
  }, [user, paymentRequests, setIsPro]);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!emailInput) return;

    // Fixed: Agar tera email match ho, toh automatically isAdmin true kar diya taaki Admin Panel button dikh jaye!
    const isAdminUser = emailInput.trim().toLowerCase() === "ravaleshubham9@gmail.com";

    const loggedUser = { 
      email: emailInput, 
      name: emailInput.split("@")[0],
      isAdmin: isAdminUser 
    };
    
    setUser(loggedUser);
    setShowAuthModal(false);

    // Check if user is already approved
    const existingReq = paymentRequests.find((req) => req.email === loggedUser.email);
    if (!existingReq || existingReq.status !== "approved") {
      setTimeout(() => setShowPayModal(true), 300);
    }
  };

  const handleUtrSubmit = (e) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.trim().length < 6) {
      alert("Please enter a valid Transaction / UTR No.!");
      return;
    }

    if (!user) {
      alert("Please Sign In first to submit payment!");
      setShowAuthModal(true);
      setShowPayModal(false);
      return;
    }

    // Save pending request instead of instant PRO unlock
    const newRequest = {
      id: Date.now(),
      email: user.email,
      utr: utrNumber.trim(),
      status: "pending",
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPaymentRequests((prev) => [newRequest, ...prev.filter((r) => r.email !== user.email)]);
    setUtrNumber("");
    alert("⏳ Payment details submitted! Admin will verify your UTR shortly.");
  };

  // Admin Actions
  const approvePayment = (reqId) => {
    setPaymentRequests((prev) =>
      prev.map((req) => (req.id === reqId ? { ...req, status: "approved" } : req))
    );
  };

  const rejectPayment = (reqId) => {
    setPaymentRequests((prev) =>
      prev.map((req) => (req.id === reqId ? { ...req, status: "rejected" } : req))
    );
  };

  const userPaymentStatus = user ? paymentRequests.find((req) => req.email === user.email) : null;

  return (
    <>
      <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "50px 20px 30px", marginTop: "80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" }}>
          
          {/* BRAND COL */}
          <div>
            <h3 style={{ color: "#fff", margin: "0 0 12px" }}>🤖 AI Interviewer</h3>
            <p style={{ fontSize: "14px", lineHeight: "1.6" }}>Smart AI coach to help you ace technical and HR interviews with real-time feedback.</p>
          </div>

          {/* FEATURES COL */}
          <div>
            <h4 style={{ color: "#fff", margin: "0 0 12px" }}>Features</h4>
            <p style={{ cursor: "pointer", color: "#818cf8" }} onClick={() => setShowPayModal(true)}>⚡ Pro AI Accuracy</p>
            <p style={{ cursor: "pointer", color: "#818cf8" }} onClick={() => setShowPayModal(true)}>👑 Premium Question Bank</p>
          </div>

          {/* ACCOUNT & ADMIN COL */}
          <div>
            <h4 style={{ color: "#fff", margin: "0 0 12px" }}>Account & Admin</h4>
            {user ? (
              <>
                <p style={{ color: "#fff", margin: "0 0 8px" }}>
                  👤 {user.name} {isPro ? <span style={{ color: "#22c55e", fontWeight: "bold" }}>👑 PRO</span> : "(Free)"}
                </p>
                {!isPro && (
                  <button onClick={() => setShowPayModal(true)} style={{ background: "#4f46e5", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", marginRight: "8px", fontWeight: "bold" }}>
                    Upgrade ₹499
                  </button>
                )}
                <button onClick={() => { setUser(null); setIsPro(false); }} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>
                  Logout
                </button>
              </>
            ) : (
              <p style={{ cursor: "pointer", color: "#818cf8", fontWeight: "bold" }} onClick={() => setShowAuthModal(true)}>
                Sign In / Register
              </p>
            )}

            {/* ADMIN PANEL LINK: Ab yeh teri email daalte hi turant dikh jayega */}
            {user && user.isAdmin && (
              <div style={{ marginTop: "15px" }}>
                <button 
                  onClick={() => setShowAdminModal(true)}
                  style={{ background: "#334155", color: "#fbbf24", border: "1px solid #475569", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  🔒 Admin Panel ({paymentRequests.filter(r => r.status === "pending").length} Pending)
                </button>
              </div>
            )}
          </div>

        </div>

        <div style={{ borderTop: "1px solid #334155", textAlign: "center", marginTop: "40px", paddingTop: "20px", fontSize: "14px" }}>
          © 2026 AI Interview Coach. All rights reserved.
        </div>
      </footer>

      {/* PAYMENT MODAL */}
      {showPayModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", maxWidth: "400px", width: "90%", textAlign: "center", color: "#1e293b", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)" }}>
            <span style={{ background: "#e0e7ff", color: "#4f46e5", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>UPGRADE TO PRO</span>
            <h2 style={{ margin: "10px 0 2px", fontSize: "26px", color: "#0f172a" }}>₹499 <span style={{ fontSize: "14px", color: "#64748b" }}>/ lifetime</span></h2>

            {userPaymentStatus ? (
              <div style={{ margin: "15px 0", padding: "12px", borderRadius: "8px", background: userPaymentStatus.status === "approved" ? "#dcfce7" : userPaymentStatus.status === "rejected" ? "#fee2e2" : "#fef9c3", border: "1px solid #cbd5e1" }}>
                {userPaymentStatus.status === "pending" && <p style={{ margin: 0, color: "#854d0e", fontWeight: "bold", fontSize: "13px" }}>⏳ Verification Pending for UTR: {userPaymentStatus.utr}<br/><span style={{ fontWeight: "normal", fontSize: "11px" }}>Admin is checking your payment.</span></p>}
                {userPaymentStatus.status === "approved" && <p style={{ margin: 0, color: "#166534", fontWeight: "bold", fontSize: "13px" }}>🎉 Approved! Your PRO plan is active.</p>}
                {userPaymentStatus.status === "rejected" && <p style={{ margin: 0, color: "#991b1b", fontWeight: "bold", fontSize: "13px" }}>❌ Rejected! Invalid UTR number provided.</p>}
              </div>
            ) : null}

            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "inline-block", marginBottom: "12px" }}>
              <img 
                src="/qr.png" 
                alt="Payment QR Code" 
                style={{ width: "170px", height: "170px", objectFit: "contain", borderRadius: "8px" }}
                onError={(e) => { e.target.src = "https://via.placeholder.com/170?text=Paste+QR+Code+in+public/qr.png"; }}
              />
              <p style={{ margin: "6px 0 0", fontSize: "12px", fontWeight: "bold", color: "#334155" }}>UPI ID: 9974058027@ibl</p>
            </div>

            <form onSubmit={handleUtrSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input 
                type="text" 
                placeholder="Enter Transaction / UTR No." 
                required 
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", textAlign: "center" }} 
              />
              <button type="submit" style={{ width: "100%", padding: "11px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
                Submit UTR for Verification →
              </button>
            </form>

            <button onClick={() => setShowPayModal(false)} style={{ background: "none", border: "none", color: "#64748b", fontSize: "13px", cursor: "pointer", marginTop: "10px" }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADMIN PANEL MODAL */}
      {showAdminModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1100 }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", maxWidth: "600px", width: "90%", color: "#1e293b", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h2 style={{ margin: 0 }}>🔐 Owner Admin Verification Panel</h2>
              <button onClick={() => setShowAdminModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>❌</button>
            </div>

            {paymentRequests.length === 0 ? (
              <p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>No payment verification requests submitted yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {paymentRequests.map((req) => (
                  <div key={req.id} style={{ padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", background: req.status === "pending" ? "#fff" : "#f8fafc" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>👤 {req.email}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#4f46e5", fontWeight: "bold" }}>UTR: {req.utr}</p>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>Time: {req.date}</span>
                    </div>

                    <div>
                      {req.status === "pending" ? (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => approvePayment(req.id)} style={{ background: "#22c55e", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                            Approve ✅
                          </button>
                          <button onClick={() => rejectPayment(req.id)} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>
                            Reject ❌
                          </button>
                        </div>
                      ) : (
                        <span style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", background: req.status === "approved" ? "#dcfce7" : "#fee2e2", color: req.status === "approved" ? "#166534" : "#991b1b" }}>
                          {req.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOGIN / REGISTER MODAL */}
      {showAuthModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", maxWidth: "400px", width: "90%", color: "#1e293b" }}>
            <h2 style={{ margin: "0 0 8px" }}>{isLoginView ? "Sign In" : "Create Account"}</h2>
            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="email" placeholder="Enter your email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <input type="password" placeholder="Password" required value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
              <button type="submit" style={{ padding: "12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                {isLoginView ? "Sign In →" : "Register & Continue →"}
              </button>
            </form>
            <p style={{ textAlign: "center", fontSize: "14px", marginTop: "15px", cursor: "pointer", color: "#4f46e5" }} onClick={() => setIsLoginView(!isLoginView)}>
              {isLoginView ? "Need an account? Register" : "Already have an account? Sign In"}
            </p>
            <button onClick={() => setShowAuthModal(false)} style={{ display: "block", margin: "10px auto 0", background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;