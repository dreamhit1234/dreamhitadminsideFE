import React, { useState } from "react";
import "./CreateSquad.scss";

export default function CreateSquadMobile() {
  const matches = [
    { id: 1, name: "India vs Pakistan" },
    { id: 2, name: "India vs Australia" },
    { id: 3, name: "MI vs CSK" },
  ];

  const players = [
    { id: 1, name: "Virat Kohli" },
    { id: 2, name: "Rohit Sharma" },
    { id: 3, name: "MS Dhoni" },
    { id: 4, name: "Jasprit Bumrah" },
    { id: 5, name: "Hardik Pandya" },
    { id: 6, name: "KL Rahul" },
    { id: 7, name: "Ravindra Jadeja" },
    { id: 8, name: "Suryakumar Yadav" },
    { id: 9, name: "Shubman Gill" },
    { id: 10, name: "Rishabh Pant" },
  ];

  const [selectedMatch, setSelectedMatch] = useState("");
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [squads, setSquads] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm1, setSearchTerm1] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");

  // Toggle player selection
  const togglePlayer = (player, team, setTeam) => {
    if (team.find((p) => p.id === player.id)) {
      setTeam(team.filter((p) => p.id !== player.id));
    } else {
      setTeam([...team, player]);
    }
  };

  // Create or update squad
  const handleCreateSquad = () => {
    if (!selectedMatch) return alert("Select a match");

    const newSquad = {
      match: matches.find((m) => m.id === parseInt(selectedMatch)),
      team1,
      team2,
    };

    if (editingIndex !== null) {
      const updated = [...squads];
      updated[editingIndex] = newSquad;
      setSquads(updated);
      setEditingIndex(null);
    } else {
      setSquads([...squads, newSquad]);
    }

    // Reset selections
    setSelectedMatch("");
    setTeam1([]);
    setTeam2([]);
    setSearchTerm1("");
    setSearchTerm2("");
  };

  const handleEdit = (index) => {
    const squad = squads[index];
    setSelectedMatch(squad.match.id.toString());
    setTeam1(squad.team1);
    setTeam2(squad.team2);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure to delete this squad?")) {
      setSquads(squads.filter((_, i) => i !== index));
    }
  };

  const filteredPlayers1 = players.filter((p) =>
    p.name.toLowerCase().includes(searchTerm1.toLowerCase())
  );
  const filteredPlayers2 = players.filter((p) =>
    p.name.toLowerCase().includes(searchTerm2.toLowerCase())
  );

  return (
    <div className="create-squad-mobile">
      <div className="dropdown-row">
        <select value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)}>
          <option value="">Select Match</option>
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="team-selection">
        {/* Team 1 */}
        <div className="team-column">
          <div className="team-title">Team 1</div>
          <input
            type="text"
            placeholder="Search player..."
            value={searchTerm1}
            onChange={(e) => setSearchTerm1(e.target.value)}
          />
          <div className="players-list">
            {filteredPlayers1.map((p) => (
              <label key={p.id}>
                <input
                  type="checkbox"
                  checked={!!team1.find((tp) => tp.id === p.id)}
                  onChange={() => togglePlayer(p, team1, setTeam1)}
                />
                {p.name}
              </label>
            ))}
          </div>
        </div>

        {/* Team 2 */}
        <div className="team-column">
          <div className="team-title">Team 2</div>
          <input
            type="text"
            placeholder="Search player..."
            value={searchTerm2}
            onChange={(e) => setSearchTerm2(e.target.value)}
          />
          <div className="players-list">
            {filteredPlayers2.map((p) => (
              <label key={p.id}>
                <input
                  type="checkbox"
                  checked={!!team2.find((tp) => tp.id === p.id)}
                  onChange={() => togglePlayer(p, team2, setTeam2)}
                />
                {p.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <button className="create-btn" onClick={handleCreateSquad}>
        {editingIndex !== null ? "Update Squad" : "Create Squad"}
      </button>

      {/* Instant Bottom View */}
      <div className="squad-view">
        {(selectedMatch || team1.length > 0 || team2.length > 0) && (
          <>
            <h3>
              Selected Match:{" "}
              {matches.find((m) => m.id === parseInt(selectedMatch))?.name || "None"}
            </h3>
            <div>
              <strong>Team 1:</strong> {team1.map((p) => p.name).join(", ") || "None"}
            </div>
            <div>
              <strong>Team 2:</strong> {team2.map((p) => p.name).join(", ") || "None"}
            </div>
          </>
        )}
      </div>

      <hr />
      <h3>Created Squads</h3>
      {squads.length === 0 && <p>No squads created yet.</p>}
      {squads.map((squad, idx) => (
        <div key={idx} className="squad-card">
          <h4>{squad.match.name}</h4>
          <div>
            <strong>Team 1:</strong> {squad.team1.map((p) => p.name).join(", ")}
          </div>
          <div>
            <strong>Team 2:</strong> {squad.team2.map((p) => p.name).join(", ")}
          </div>
          <button onClick={() => handleEdit(idx)}>Edit</button>
          <button onClick={() => handleDelete(idx)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
