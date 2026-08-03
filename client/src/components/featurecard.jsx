function FeatureCard() {
  return (
    <section className="features">
      <h2>Our Features</h2>

      <div className="feature-container">

        <div className="card">
          <h3>AI Questions</h3>
          <p>Practice unlimited interview questions.</p>
        </div>

        <div className="card">
          <h3>Instant Feedback</h3>
          <p>Get suggestions to improve your answers.</p>
        </div>

        <div className="card">
          <h3>Progress Tracking</h3>
          <p>Monitor your interview preparation.</p>
        </div>

      </div>
    </section>
  );
}

export default FeatureCard;