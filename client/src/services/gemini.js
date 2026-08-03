export async function analyzeAnswer(promptTitle, interviewData) {
  // Simulate network delay like real AI (0.8 seconds)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Extract answers from interviewData text
  const lines = interviewData.split("\n").filter((line) => line.startsWith("A:"));
  
  let wordCount = 0;

  lines.forEach((line) => {
    const text = line.replace("A:", "").trim();
    wordCount += text.split(/\s+/).filter(Boolean).length;
  });

  const totalQuestions = lines.length || 1;
  const avgWordsPerAnswer = wordCount / totalQuestions;

  // 🎯 Dynamic Score Calculation Logic
  let baseScore = 60;

  if (avgWordsPerAnswer > 15) baseScore += 25;
  else if (avgWordsPerAnswer > 8) baseScore += 15;
  else if (avgWordsPerAnswer > 3) baseScore += 5;

  // Random variations to look like real AI analysis
  const score = Math.min(100, Math.max(30, Math.floor(baseScore + (Math.random() * 10 - 5))));
  const grammar = Math.min(100, Math.max(40, Math.floor(score + (Math.random() * 8 - 4))));
  const communication = Math.min(100, Math.max(35, Math.floor(score + (Math.random() * 10 - 5))));
  const confidence = Math.min(100, Math.max(40, Math.floor(score + (Math.random() * 6 - 3))));

  // Dynamic Suggestions based on performance
  const suggestions = [];
  if (avgWordsPerAnswer < 5) {
    suggestions.push("Try to provide detailed answers instead of one-word replies.");
    suggestions.push("Explain your reasoning behind each answer.");
  } else {
    suggestions.push("Great answer depth! Keep structuring your thoughts clearly.");
    suggestions.push("Try adding real-life or technical examples to back your points.");
  }
  suggestions.push("Maintain a steady pace while speaking or writing.");

  // Clean feedback assignment without useless initialization
  let feedback;
  if (score >= 80) {
    feedback = "Excellent responses! You showed clear understanding and good communication skills.";
  } else if (score >= 60) {
    feedback = "Satisfactory interview performance. Expanding your answers will help you score higher.";
  } else {
    feedback = "Needs improvement. Try practicing short technical/HR notes before taking the test.";
  }

  return {
    score,
    grammar,
    communication,
    confidence,
    feedback,
    suggestions,
  };
}