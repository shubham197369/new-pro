import { useState, useEffect } from "react";

function Interview({ domain, onFinish }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [isListening, setIsListening] = useState(false);

  // Dynamic Category Questions
  const questionBank = {
    Frontend: [
      "What is the difference between React virtual DOM and real DOM?",
      "How does the useEffect hook work in React?",
      "Explain CSS Flexbox vs Grid layout.",
      "What is State Management and why is Redux/Context used?",
      "How do you optimize performance in a Web App?"
    ],
    Backend: [
      "Explain the event loop in Node.js.",
      "What is the difference between SQL and NoSQL databases?",
      "How do JWT tokens work for authentication?",
      "What are REST APIs and how do they differ from GraphQL?",
      "How do you handle errors gracefully in Express.js?"
    ],
    HR: [
      "Tell me about yourself.",
      "What are your greatest strengths and weaknesses?",
      "Where do you see yourself in 5 years?",
      "Describe a challenging project you worked on.",
      "Why should we hire you over other candidates?"
    ]
  };

  const questions = questionBank[domain] || questionBank.HR;

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Voice Recognition (Speech to Text)
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion]: (prev[currentQuestion] ? prev[currentQuestion] + " " : "") + transcript
      }));
    };

    recognition.start();
  };

  const handleAnswerChange = (text) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: text
    }));
  };

  const handleFinish = async () => {
    const score = Math.floor(Math.random() * 20) + 75;
    const evaluationData = {
      score,
      answers,
      domain: domain || "HR",
      feedback: "Good response structure! Metric-driven details were well explained."
    };

    try {
      await fetch("http://localhost:5000/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evaluationData)
      });
      console.log("✅ Interview saved to MongoDB!");
    } catch (error) {
      console.error("❌ Error saving to MongoDB:", error);
    }

    if (onFinish) {
      onFinish(evaluationData);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", color: "#f8fafc" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#818cf8" }}>Category : {domain || "HR"}</h2>
        <h3 style={{ color: timeLeft < 15 ? "#ef4444" : "#f59e0b" }}>
          ⏱️ Time Left: {timeLeft} sec
        </h3>
        <p style={{ color: "#94a3b8" }}>
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", color: "#1e293b", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {questions[currentQuestion]}
        </h2>

        <textarea
          rows={6}
          placeholder="Type or speak your answer here..."
          value={answers[currentQuestion] || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "15px", resize: "none", boxSizing: "border-box" }}
        />

        <div style={{ textAlign: "center", margin: "20px 0 10px" }}>
          <button
            onClick={startListening}
            style={{
              background: isListening ? "#ef4444" : "#4f46e5",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {isListening ? "🔴 Listening..." : "🎙️ Speak Answer"}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            style={{ background: currentQuestion === 0 ? "#94a3b8" : "#4f46e5", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: currentQuestion === 0 ? "not-allowed" : "pointer" }}
          >
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleFinish}
              style={{ background: "#22c55e", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}
            >
              Finish Interview 🎉
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              style={{ background: "#4f46e5", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              Next Question →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Interview;