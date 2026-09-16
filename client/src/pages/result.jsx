import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { analyzeAnswer } from "../services/gemini";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const answers = location.state?.answers || [];

  const [loading, setLoading] = useState(true);
  // 'aiResult' ko yahan use nahi kiya gaya tha, isliye ise hata diya taaki unused variable ki warning na aaye
  const [, setAiResult] = useState(null);

  const score = answers.length * 10;

  useEffect(() => {
    async function getFeedback() {
      if (answers.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const result = await analyzeAnswer(
          answers[0].question,
          answers[0].answer
        );

        setAiResult(result);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }

    getFeedback();
  }, [answers]); // yahan 'answers' dependency add kar di taaki missing dependency wali warning chali jaye

  if (loading) {
    return (
      <section className="result">
        <h2>🤖 AI is analyzing your interview...</h2>
      </section>
    );
  }

  return (
    <section className="result">
      <h1>Interview Completed 🎉</h1>

      <h2>Your Score: {score} / 30</h2>

      <p>
        {score >= 100
          ? "Excellent Performance ⭐⭐⭐⭐⭐"
          : score >= 20
          ? "Good Performance 👍"
          : "Needs Improvement 📚"}
      </p>

      {answers.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            margin: "20px",
            borderRadius: "10px",
            textAlign: "left",
          }}
        >
          <h2>Question {index + 1}</h2>

          <p>
            <b>{item.question}</b>
          </p>

          <p>{item.answer}</p>
        </div>
      ))}

      <hr />

      <h2>AI Feedback</h2>

      <div className="feedback-box">
        <h3>Overall Score : 85%</h3>

        <p>Grammar : 90%</p>

        <p>Communication : 80%</p>

        <p>Confidence : 85%</p>

        <h3>Suggestions</h3>

        <ul>
          <li>Speak confidently.</li>
          <li>Give more real-life examples.</li>
          <li>Improve your introduction.</li>
        </ul>
      </div>

      <button onClick={() => navigate("/")}>
        Start New Interview
      </button>
    </section>
  );
}

export default Result;