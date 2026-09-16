import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import allQuestions from "../data/questions";
import { useRef } from "react";
function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  const category = location.state?.category || "HR";

  const questions = [...allQuestions[category]]

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (timeLeft === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  function previousQuestion() {

  if (currentQuestion > 0) {

    setCurrentQuestion(currentQuestion - 1);

    setAnswer(answers[currentQuestion - 1]?.answer || "");

    setTimeLeft(60);

  }

}
function startListening() {

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    setAnswer(event.results[0][0].transcript);
  };

  recognition.start();

  recognitionRef.current = recognition;
}
  function nextQuestion() {
    if (answer.trim() === "") {
      alert("Please enter your answer.");
      return;
    }

    const currentAnswer = {
  question: questions[currentQuestion],
  answer: answer
};

const updatedAnswers = [...answers];

updatedAnswers[currentQuestion] = currentAnswer;

setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
      setTimeLeft(60);
    } else {
      navigate("/result", {
        state: {
          answers: updatedAnswers
        }
      });
    }
  }

  return (
    <section className="interview">

      <h1>AI Interview</h1>

      <h3>Category : {category}</h3>

      <h3>⏱ Time Left: {timeLeft} sec</h3>

      <p>
        Question {currentQuestion + 1} of {questions.length}
      </p>

      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${((currentQuestion + 1) / questions.length) * 100}%`
          }}
        ></div>
      </div>

      <div className="question-box">

        <h2>{questions[currentQuestion]}</h2>

        <textarea
          rows="8"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        ></textarea>

        <br /><button onClick={startListening}>
  🎤 Speak Answer
</button>

<br />
<br />
         <button
  onClick={previousQuestion}
  disabled={currentQuestion === 0}
>
  Previous
</button>
        <button onClick={nextQuestion}>
          {currentQuestion === questions.length - 1
            ? "Finish Interview"
            : "Next Question"}
        </button>

      </div>

    </section>
  );
}

export default Interview;