const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI = "mongodb://localhost:27017/ai_interviewer";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("⚠️ MongoDB Connection Error:", err.message));

// --- SCHEMAS & MODELS ---

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPro: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// Interview Schema
const interviewSchema = new mongoose.Schema({
  userId: { type: String, default: "guest" },
  domain: { type: String, default: "HR" },
  score: { type: Number, required: true },
  feedback: { type: String, default: "" },
  answers: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

const Interview = mongoose.model("Interview", interviewSchema);


// --- API ROUTES ---

app.get("/", (req, res) => {
  res.send("AI Interviewer API Server Running! 🚀");
});

// 1. Signup Route
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully!",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, isPro: newUser.isPro }
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// 2. Login Route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful!",
      user: { id: user._id, name: user.name, email: user.email, isPro: user.isPro }
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// 3. Get User Interviews History
app.get("/api/interviews", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const history = await Interview.find(query).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch interview history" });
  }
});

// 4. Save Interview Result
app.post("/api/interviews", async (req, res) => {
  try {
    const { userId, domain, score, feedback, answers } = req.body;
    const newInterview = new Interview({ userId: userId || "guest", domain, score, feedback, answers });
    await newInterview.save();
    res.status(201).json({ message: "Saved successfully!", data: newInterview });
  } catch (err) {
    res.status(500).json({ error: "Failed to save interview" });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});