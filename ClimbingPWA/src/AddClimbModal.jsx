import { useMemo, useState } from "react";

const boulderingGrades = ["V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"];
const ropeGrades = [
  "5.6",
  "5.7",
  "5.8",
  "5.9",
  "5.10a",
  "5.10b",
  "5.10c",
  "5.10d",
  "5.11a",
  "5.11b",
  "5.11c",
  "5.11d",
  "5.12a",
  "5.12b",
  "5.12c",
  "5.12d",
];

const colorOptions = ["Red", "Blue", "Green", "Yellow", "Black", "Purple", "Orange", "Pink"];

export default function AddClimbModal({ climbType, existingClimb, onClose, onSave, onDelete }) {
  const gradeOptions = useMemo(() => {
    return climbType === "Ropes" ? ropeGrades : boulderingGrades;
  }, [climbType]);

  const [name, setName] = useState(existingClimb?.name ?? "");
  const [location, setLocation] = useState(existingClimb?.location ?? "");
  const [grade, setGrade] = useState(existingClimb?.grade ?? gradeOptions[0]);
  const [color, setColor] = useState(existingClimb?.color ?? colorOptions[0]);
  const [attempts, setAttempts] = useState(existingClimb?.attempts ?? 1);

  function handleSave(event) {
    event.preventDefault();

    const climbToSave = {
      id: existingClimb?.id ?? Date.now(),
      name: name.trim() || "Unnamed Climb",
      location: location.trim() || "Unknown Location",
      grade,
      color,
      attempts: Number(attempts) || 1,
      climbType,
    };

    onSave(climbToSave);
    onClose();
  }

  function handleDelete() {
    if (!existingClimb) return;
    onDelete(existingClimb.id);
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <p className="section-label">{existingClimb ? "Edit Climb" : "Add Climb"}</p>
        <h2>{climbType} Climb</h2>

        <form className="climb-form" onSubmit={handleSave}>
          <label className="form-field">
            <span>Route Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Route Name"
            />
          </label>

          <label className="form-field">
            <span>Location</span>
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Location or Gym"
            />
          </label>

          <label className="form-field">
            <span>Grade</span>
            <select value={grade} onChange={(event) => setGrade(event.target.value)}>
              {gradeOptions.map((gradeOption) => (
                <option key={gradeOption} value={gradeOption}>
                  {gradeOption}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Hold Color</span>
            <select value={color} onChange={(event) => setColor(event.target.value)}>
              {colorOptions.map((colorOption) => (
                <option key={colorOption} value={colorOption}>
                  {colorOption}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Attempts</span>
            <input
              type="number"
              min="1"
              value={attempts}
              onChange={(event) => setAttempts(event.target.value)}
            />
          </label>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>

            {existingClimb ? (
              <button type="button" className="delete-button" onClick={handleDelete}>
                Delete
              </button>
            ) : null}

            <button type="submit" className="primary-button">
              Save Climb
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
