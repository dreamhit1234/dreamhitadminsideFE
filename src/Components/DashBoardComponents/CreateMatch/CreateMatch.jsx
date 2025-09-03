import React, { useState } from "react";
import "./CreateMatch.scss";

export default function CreateMatch({ matches, setMatches }) {
  const [newMatch, setNewMatch] = useState({
    series: "",
    team1: "",
    team2: "",
    format: "",
    count: "",
    date: "",
    time: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [editMatch, setEditMatch] = useState({});

  const handleChange = (e) => {
    setNewMatch({ ...newMatch, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const matchObj = {
      series: newMatch.series,
      name: `${newMatch.team1} v ${newMatch.team2}`,
      format: newMatch.format,
      count: newMatch.count,
      date: newMatch.date,
      time: newMatch.time,
    };
    setMatches([...matches, matchObj]);
    setNewMatch({
      series: "",
      team1: "",
      team2: "",
      format: "",
      count: "",
      date: "",
      time: "",
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditMatch({ ...matches[index] });
  };

  const handleSave = () => {
    const updated = [...matches];
    updated[editingIndex] = editMatch;
    setMatches(updated);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updated = matches.filter((_, i) => i !== index);
    setMatches(updated);
  };

  return (
    <div className="admin-matches">
      <form className="create-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="series"
          placeholder="Series Name"
          value={newMatch.series}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="team1"
          placeholder="Team 1"
          value={newMatch.team1}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="team2"
          placeholder="Team 2"
          value={newMatch.team2}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={newMatch.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={newMatch.time}
          onChange={handleChange}
          required
        />
        <select
          name="format"
          value={newMatch.format}
          onChange={handleChange}
          required
        >
          <option value="">Select Format</option>
          <option value="T20">T20</option>
          <option value="ODI">ODI</option>
          <option value="WT20">WT20</option>
          <option value="WODI">WODI</option>
        </select>
        <select
          name="count"
          value={newMatch.count}
          onChange={handleChange}
          required
        >
          <option value="">Select Count</option>
          <option value="6">6</option>
          <option value="6+4">6+4</option>
        </select>
        <button type="submit">Add Match</button>
      </form>

      <div className="matches-list">
        {matches.length === 0 ? (
          <p>No matches created yet.</p>
        ) : (
          matches.map((match, index) => (
            <div key={index} className="match-item">
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editMatch.series}
                    onChange={(e) =>
                      setEditMatch({ ...editMatch, series: e.target.value })
                    }
                    placeholder="Series Name"
                  />
                  <input
                    type="text"
                    value={editMatch.name}
                    onChange={(e) =>
                      setEditMatch({ ...editMatch, name: e.target.value })
                    }
                    placeholder="Team1 v Team2"
                  />
                  <input
                    type="date"
                    value={editMatch.date}
                    onChange={(e) =>
                      setEditMatch({ ...editMatch, date: e.target.value })
                    }
                  />
                  <input
                    type="time"
                    value={editMatch.time}
                    onChange={(e) =>
                      setEditMatch({ ...editMatch, time: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={editMatch.format}
                    onChange={(e) =>
                      setEditMatch({ ...editMatch, format: e.target.value })
                    }
                    placeholder="Format"
                  />
                  <input
                    type="text"
                    value={editMatch.count}
                    onChange={(e) =>
                      setEditMatch({ ...editMatch, count: e.target.value })
                    }
                    placeholder="Count"
                  />
                  <div className="edit-actions">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditingIndex(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="series-name">{match.series}</div>
                  <div className="match-info">
                    {match.name} | {match.format} | Count {match.count} | {match.date} {match.time}
                  </div>
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
    </div>
  );
}
