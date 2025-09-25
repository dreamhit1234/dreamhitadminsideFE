import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateMatch.scss";

export default function CreateMatch() {
  const [matches, setMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({
    series: "",
    team1: "",
    team2: "",
    format: "T20",
    count: "6",
    date: "",
    time: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editMatch, setEditMatch] = useState({});
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await axios.get("http://localhost:8080/matches");
      setMatches(res.data);
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  // Automatically set count based on format
  const handleFormatChange = (format) => {
    let count = "6"; // default T20
    if (format === "ODI") count = "6+4";
    if (format === "WomensT20" || format === "WomensODI") count = "4+6";
    setNewMatch({ ...newMatch, format, count });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const matchToSend = { ...newMatch, time: `${newMatch.date}T${newMatch.time}` };
      const res = await axios.post("http://localhost:8080/matches", matchToSend);
      setMatches([...matches, res.data]);
      setNewMatch({ series: "", team1: "", team2: "", format: "T20", count: "6", date: "", time: "" });
    } catch (err) {
      console.error("Error creating match:", err);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/matches/${id}`);
    setMatches(matches.filter((m) => m.id !== id));
  };

  const handleEdit = (match) => {
    setEditingId(match.id);
    const [datePart, timePart] = match.time.split("T");
    setEditMatch({ ...match, date: datePart, time: timePart });
  };

  const handleUpdate = async (id) => {
    const updatedMatch = { ...editMatch, time: `${editMatch.date}T${editMatch.time}` };
    const res = await axios.put(`http://localhost:8080/matches/${id}`, updatedMatch);
    setMatches(matches.map((m) => (m.id === id ? res.data : m)));
    setEditingId(null);
  };

  // Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      matches.forEach((match) => {
        let matchTime = new Date(match.time);
        const now = new Date().getTime();
        const diff = matchTime.getTime() - now;

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          newCountdowns[match.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else if (diff <= 0 && diff > -3600 * 1000) {
          newCountdowns[match.id] = "Processing";
        } else {
          newCountdowns[match.id] = "Over";
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [matches]);

  return (
    <div className="admin-matches">
      <form className="create-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Series" value={newMatch.series} onChange={(e) => setNewMatch({ ...newMatch, series: e.target.value })} required />
        <input type="text" placeholder="Team 1" value={newMatch.team1} onChange={(e) => setNewMatch({ ...newMatch, team1: e.target.value })} required />
        <input type="text" placeholder="Team 2" value={newMatch.team2} onChange={(e) => setNewMatch({ ...newMatch, team2: e.target.value })} required />

        <select value={newMatch.format} onChange={(e) => handleFormatChange(e.target.value)} required>
          <option value="T20">T20</option>
          <option value="ODI">ODI</option>
          <option value="WomensT20">WomensT20</option>
          <option value="WomensODI">WomensODI</option>
        </select>

        <input type="number" placeholder="Count" value={newMatch.count} readOnly />

        <input type="date" value={newMatch.date} onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })} required />
        <input type="time" value={newMatch.time} onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })} required />
        <button type="submit">Create Match</button>
      </form>

      <div className="matches-list">
        {matches.map((match) => (
          <div key={match.id} className="match-item">
            <div className="series-name">{match.series}</div>
            <div className="match-info">
              {match.team1} vs {match.team2} | {match.format} | Count {match.count}
            </div>
            <div className="match-time">
              {match.date} {match.time} | Countdown: {countdowns[match.id]}
            </div>
            <div className="match-actions">
              <button onClick={() => handleEdit(match)}>Edit</button>
              <button onClick={() => handleDelete(match.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
