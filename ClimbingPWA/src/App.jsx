import { useEffect, useMemo, useState } from "react";
import "./App.css";
import AddClimbModal from "./AddClimbModal";
import HomeView from "./components/HomeView";
import NotesView from "./components/NotesView";

const STORAGE_KEY = "climbing-pwa-climbs";

const starterClimbs = [
  {
    id: 1,
    name: "Blue Moon",
    location: "Campus Gym",
    grade: "V3",
    color: "Blue",
    attempts: 4,
    climbType: "Bouldering",
  },
  {
    id: 2,
    name: "Red Arete",
    location: "Campus Gym",
    grade: "V5",
    color: "Red",
    attempts: 7,
    climbType: "Bouldering",
  },
  {
    id: 3,
    name: "Morning Face",
    location: "Wall East",
    grade: "5.10b",
    color: "Yellow",
    attempts: 2,
    climbType: "Ropes",
  },
  {
    id: 4,
    name: "Anchor Line",
    location: "Wall East",
    grade: "5.11a",
    color: "Green",
    attempts: 5,
    climbType: "Ropes",
  },
];

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

function getBoulderingRank(grade) {
  return Number.parseInt(grade.replace("V", ""), 10) || 0;
}

function getRopeRank(grade) {
  return ropeGrades.indexOf(grade);
}

function sortClimbs(climbs, climbType) {
  return [...climbs].sort((a, b) => {
    const aRank =
      climbType === "Bouldering"
        ? getBoulderingRank(a.grade)
        : getRopeRank(a.grade);

    const bRank =
      climbType === "Bouldering"
        ? getBoulderingRank(b.grade)
        : getRopeRank(b.grade);

    return bRank - aRank;
  });
}

function getProgressStats(climbs, climbType) {
  if (climbType === "Bouldering") {
    const values = climbs.map((climb) => getBoulderingRank(climb.grade));
    let current = 0;

    while (values.filter((value) => value >= current).length >= 3) {
      current += 1;
    }

    current -= 1;
    if (current < 0) current = 0;

    const progress = values.filter((value) => value >= current + 1).length;

    return {
      level: `V${current}`,
      progress: Math.min(progress, 3),
    };
  }

  const values = climbs
    .map((climb) => getRopeRank(climb.grade))
    .filter((value) => value >= 0);

  let current = 0;

  while (values.filter((value) => value >= current).length >= 3) {
    current += 1;
  }

  current -= 1;
  if (current < 0) current = 0;

  const progress = values.filter((value) => value >= current + 1).length;

  return {
    level: ropeGrades[current] ?? "5.6",
    progress: Math.min(progress, 3),
  };
}

function loadSavedClimbs() {
  const savedClimbs = localStorage.getItem(STORAGE_KEY);

  if (!savedClimbs) {
    return starterClimbs;
  }

  try {
    return JSON.parse(savedClimbs);
  } catch {
    return starterClimbs;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("boulderingNotes");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClimb, setEditingClimb] = useState(null);
  const [climbs, setClimbs] = useState(loadSavedClimbs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(climbs));
  }, [climbs]);

  const boulderingClimbs = useMemo(
    () =>
      sortClimbs(
        climbs.filter((climb) => climb.climbType === "Bouldering"),
        "Bouldering"
      ),
    [climbs]
  );

  const ropesClimbs = useMemo(
    () =>
      sortClimbs(
        climbs.filter((climb) => climb.climbType === "Ropes"),
        "Ropes"
      ),
    [climbs]
  );

  const boulderingStats = useMemo(
    () => getProgressStats(boulderingClimbs, "Bouldering"),
    [boulderingClimbs]
  );

  const ropesStats = useMemo(
    () => getProgressStats(ropesClimbs, "Ropes"),
    [ropesClimbs]
  );

  function handleAddClimb(newClimb) {
    setClimbs((currentClimbs) => [...currentClimbs, newClimb]);
  }

  function handleEditClimb(updatedClimb) {
    setClimbs((currentClimbs) =>
      currentClimbs.map((climb) =>
        climb.id === updatedClimb.id ? updatedClimb : climb
      )
    );
  }

  function handleDeleteClimb(climbId) {
    setClimbs((currentClimbs) =>
      currentClimbs.filter((climb) => climb.id !== climbId)
    );
  }

  function openAddModal() {
    setEditingClimb(null);
    setShowAddModal(true);
  }

  function openEditModal(climb) {
    setEditingClimb(climb);
    setShowAddModal(true);
  }

  function closeModal() {
    setEditingClimb(null);
    setShowAddModal(false);
  }

  const currentClimbType = currentPage.includes("ropes") ? "Ropes" : "Bouldering";

  let content = null;
  let title = "";

  if (currentPage === "boulderingNotes") {
    title = "Bouldering Notes";
    content = <NotesView climbs={boulderingClimbs} onEditClimb={openEditModal} />;
  } else if (currentPage === "boulderingHome") {
    title = "Bouldering Home";
    content = (
      <HomeView
        label="Bouldering Level"
        level={boulderingStats.level}
        progress={boulderingStats.progress}
      />
    );
  } else if (currentPage === "ropesHome") {
    title = "Ropes Home";
    content = (
      <HomeView
        label="Ropes Level"
        level={ropesStats.level}
        progress={ropesStats.progress}
      />
    );
  } else {
    title = "Ropes Notes";
    content = <NotesView climbs={ropesClimbs} onEditClimb={openEditModal} />;
  }

  return (
    <div className="app-shell">
      <header className="top-bar">
        <h1>{title}</h1>
        <button className="add-button" onClick={openAddModal}>
          +
        </button>
      </header>

      <main className="main-content">{content}</main>

      <nav className="bottom-nav">
        <button
          className={currentPage === "boulderingNotes" ? "nav-button active" : "nav-button"}
          onClick={() => setCurrentPage("boulderingNotes")}
        >
          Boulder Notes
        </button>

        <button
          className={currentPage === "boulderingHome" ? "nav-button active" : "nav-button"}
          onClick={() => setCurrentPage("boulderingHome")}
        >
          Boulder Home
        </button>

        <button
          className={currentPage === "ropesHome" ? "nav-button active" : "nav-button"}
          onClick={() => setCurrentPage("ropesHome")}
        >
          Ropes Home
        </button>

        <button
          className={currentPage === "ropesNotes" ? "nav-button active" : "nav-button"}
          onClick={() => setCurrentPage("ropesNotes")}
        >
          Ropes Notes
        </button>
      </nav>

      {showAddModal ? (
        <AddClimbModal
          climbType={editingClimb?.climbType ?? currentClimbType}
          existingClimb={editingClimb}
          onClose={closeModal}
          onSave={editingClimb ? handleEditClimb : handleAddClimb}
          onDelete={handleDeleteClimb}
        />
      ) : null}
    </div>
  );
}
