import React, { useState } from "react";
import "./Matches.scss";

export default function Matches({ matches, setMatches }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editMatch, setEditMatch] = useState({
    series: "",
    name: "",
    time: "",
    format: "",
    count: "",
  });

  // Start editing
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditMatch({ ...matches[index] });
  };

  // Save edited match
  const handleSave = () => {
    const updatedMatches = [...matches];
    updatedMatches[editingIndex] = editMatch;
    setMatches(updatedMatches);
    setEditingIndex(null);
  };

  // Delete match
  const handleDelete = (index) => {
    const updatedMatches = matches.filter((_, i) => i !== index);
    setMatches(updatedMatches);
  };

  return (
    <div className="matches-list-page">
      <h3>All Matches</h3>
      {matches.length === 0 ? (
        <p>No matches created yet.</p>
      ) : (
        matches.map((match, index) => (
          <div key={index} className="match-item">
            {editingIndex === index ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editMatch.series}
                  onChange={(e) => setEditMatch({ ...editMatch, series: e.target.value })}
                  placeholder="Series Name"
                />
                <input
                  type="text"
                  value={editMatch.name}
                  onChange={(e) => setEditMatch({ ...editMatch, name: e.target.value })}
                  placeholder="Team1 v Team2"
                />
                <input
                  type="datetime-local"
                  value={editMatch.time}
                  onChange={(e) => setEditMatch({ ...editMatch, time: e.target.value })}
                />
                <input
                  type="text"
                  value={editMatch.format}
                  onChange={(e) => setEditMatch({ ...editMatch, format: e.target.value })}
                  placeholder="Format"
                />
                <input
                  type="text"
                  value={editMatch.count}
                  onChange={(e) => setEditMatch({ ...editMatch, count: e.target.value })}
                  placeholder="Count"
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditingIndex(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <div className="series-name">{match.series}</div>
                <div className="match-info">{match.name} | {match.format} | Count {match.count}</div>
                <div className="match-time">{match.time}</div>
                <div className="match-actions">
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
