import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Result from "./pages/result";
import Practice from "./pages/practice";
import Interview from "./pages/interview";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}

export default App;