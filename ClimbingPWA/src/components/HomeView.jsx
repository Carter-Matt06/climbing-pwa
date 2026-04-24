export default function HomeView({ label, level, progress }) {
  return (
    <section className="home-panel">
      <p className="section-label">{label}</p>

      <div className="level-ring">
        <span>{level}</span>
      </div>

      <div className="progress-block">
        <p>Progress to next grade</p>
        <div className="progress-row">
          <div className={progress >= 1 ? "progress-dot filled" : "progress-dot"} />
          <div className={progress >= 2 ? "progress-dot filled" : "progress-dot"} />
          <div className={progress >= 3 ? "progress-dot filled" : "progress-dot"} />
        </div>
      </div>
    </section>
  );
}
