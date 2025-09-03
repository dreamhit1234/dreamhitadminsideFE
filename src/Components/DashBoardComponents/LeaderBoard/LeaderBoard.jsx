import React, { useState } from "react";
import "./LeaderBoard.scss";

const LeaderBoardAdmin = () => {
  const matches = [
    { id: 1, name: "India vs Pakistan" },
    { id: 2, name: "India vs Australia" },
    { id: 3, name: "MI vs CSK" },
  ];

  const staticPlayers = [
    { id: 1, name: "Virat Kohli" },
    { id: 2, name: "Rohit Sharma" },
    { id: 3, name: "MS Dhoni" },
    { id: 4, name: "Hardik Pandya" },
    { id: 5, name: "KL Rahul" },
    { id: 6, name: "Shubman Gill" },
    { id: 7, name: "Rishabh Pant" },
    { id: 8, name: "Sanju Samson" },
    { id: 9, name: "David Warner" },
    { id: 10, name: "Glenn Maxwell" },
    { id: 11, name: "Suryakumar Yadav" },
    { id: 12, name: "Faf du Plessis" },
  ];

  const [selectedMatch, setSelectedMatch] = useState("");
  const [players, setPlayers] = useState([]);

  const handleMatchSelect = (id) => {
    setSelectedMatch(id);
    // Populate players for selected match
    setPlayers(staticPlayers.map(p => ({ ...p, fours: 0, sixes: 0 })));
  };

  const handleIncrement = (id, field) => {
    setPlayers(prev =>
      prev.map(p =>
        p.id === id ? { ...p, [field]: p[field] + 1 } : p
      )
    );
  };

  const handleEdit = (id, field, value) => {
    setPlayers(prev =>
      prev.map(p =>
        p.id === id ? { ...p, [field]: Number(value) || 0 } : p
      )
    );
  };

  const calculateRuns = (p) => p.fours * 4 + p.sixes * 6;

  return (
    <div className="leaderboard-admin">

      <div className="match-select">
        <label>Select Match: </label>
        <select
          value={selectedMatch}
          onChange={(e) => handleMatchSelect(e.target.value)}
        >
          <option value="">-- Select --</option>
          {matches.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {selectedMatch && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>4s</th>
                <th>6s</th>
                <th>Runs</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td>
                    <div className="cell">
                      <button onClick={() => handleIncrement(p.id, "fours")}>+4</button>
                      <input
                        type="number"
                        value={p.fours}
                        onChange={(e) => handleEdit(p.id, "fours", e.target.value)}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="cell">
                      <button onClick={() => handleIncrement(p.id, "sixes")}>+6</button>
                      <input
                        type="number"
                        value={p.sixes}
                        onChange={(e) => handleEdit(p.id, "sixes", e.target.value)}
                      />
                    </div>
                  </td>
                  <td>{calculateRuns(p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaderBoardAdmin;
