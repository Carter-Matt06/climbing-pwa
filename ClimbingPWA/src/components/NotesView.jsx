const colorMap = {
  Red: "#c0392b",
  Blue: "#2980b9",
  Green: "#27ae60",
  Yellow: "#d4ac0d",
  Black: "#2d3436",
  Purple: "#8e44ad",
  Orange: "#e67e22",
  Pink: "#e84393",
};

export default function NotesView({ climbs, onEditClimb }) {
  if (climbs.length === 0) {
    return (
      <section className="card">
        <p className="section-label">No Climbs Yet</p>
        <h2>Start Logging</h2>
        <p>Add your first climb with the plus button.</p>
      </section>
    );
  }

  return (
    <section className="climb-list">
      {climbs.map((climb) => (
        <article
          className="climb-card clickable-card"
          key={climb.id}
          onClick={() => onEditClimb(climb)}
        >
          <div
            className="grade-pill"
            style={{ backgroundColor: colorMap[climb.color] ?? "#0a84c6" }}
          >
            {climb.grade}
          </div>

          <div className="climb-info">
            <h3>{climb.name}</h3>
            <p>{climb.location}</p>
          </div>

          <div className="attempts-box">
  {climb.attempts === 1 ? (
    <>
      <strong>Flash!</strong>
      <span>1 Attempt</span>
    </>
  ) : (
    <>
      <strong>{climb.attempts}</strong>
      <span>Attempts</span>
    </>
  )}
</div>

        </article>
      ))}
    </section>
  );
}
