import React, { useState } from "react";
import axios from "axios";
import "./Matches.scss";

export default function Matches({ matches, setMatches }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editMatch, setEditMatch] = useState({});

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditMatch({ ...matches[index] });
  };

  const handleSave = async () => {
    try {
      const id = editMatch.id;
      const res = await axios.put(`http://localhost:8080/matches/${id}`, editMatch);
      const updated = [...matches];
      updated[editingIndex] = res.data;
      setMatches(updated);
      setEditingIndex(null);
    } catch (err) {
      console.error("Error updating match:", err);
    }
  };

  const handleDelete = async (index) => {
    try {
      const id = matches[index].id;
      await axios.delete(`http://localhost:8080/matches/${id}`);
      setMatches(matches.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting match:", err);
    }
  };

  return (
    <div className="matches-list-page">
      {matches.length === 0 ? (
        <p>No matches created yet.</p>
      ) : (
        matches.map((match, index) => (
          <div key={index} className="match-item">
            {editingIndex === index ? (
              <div className="edit-form">
                <input type="text" value={editMatch.series} onChange={(e) => setEditMatch({ ...editMatch, series: e.target.value })} />
                <input type="text" value={editMatch.name} onChange={(e) => setEditMatch({ ...editMatch, name: e.target.value })} />
                <input type="date" value={editMatch.date} onChange={(e) => setEditMatch({ ...editMatch, date: e.target.value })} />
                <input type="time" value={editMatch.time} onChange={(e) => setEditMatch({ ...editMatch, time: e.target.value })} />
                <input type="text" value={editMatch.format} onChange={(e) => setEditMatch({ ...editMatch, format: e.target.value })} />
                <input type="text" value={editMatch.count} onChange={(e) => setEditMatch({ ...editMatch, count: e.target.value })} />
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditingIndex(null)}>Cancel</button>
              </div>
            ) : (
              <div className="match-display">
                <div>{match.series}</div>
                <div>{match.name} | {match.format} | Count {match.count}</div>
                <div>{match.date} {match.time}</div>
                <div>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
