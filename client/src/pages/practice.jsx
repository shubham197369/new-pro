import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Practice() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("HR");
  const [difficulty, setDifficulty] = useState("Easy");

  function startInterview() {
    navigate("/interview", {
      state: {
        category,
        difficulty
      }
    });
  }

  return (
    <section className="practice">

      <h1>Interview Practice</h1>

      <p>Select your interview type and difficulty level.</p>

      <div className="practice-box">

        <h3>Choose Category</h3>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>HR</option>
          <option>Technical</option>
          <option>Aptitude</option>
        </select>

        <h3>Difficulty</h3>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <br /><br />

        <button onClick={startInterview}>
          Start Interview
        </button>

      </div>

    </section>
  );
}

export default Practice;