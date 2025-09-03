import React, { useState } from "react";
import "./CreatePlayers.scss";

export default function CreatePlayers({ players, setPlayers }) {
  const [newPlayer, setNewPlayer] = useState({ name: "", image: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editPlayer, setEditPlayer] = useState({ name: "", image: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newPlayer.name || !newPlayer.image) return;
    setPlayers([...players, newPlayer]);
    setNewPlayer({ name: "", image: "" });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditPlayer({ ...players[index] });
  };

  const handleSave = () => {
    const updatedPlayers = [...players];
    updatedPlayers[editingIndex] = editPlayer;
    setPlayers(updatedPlayers);
    setEditingIndex(null);
  };

  return (
    <div className="create-players">
      <form className="add-player-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Player Name"
          value={newPlayer.name}
          onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newPlayer.image}
          onChange={(e) => setNewPlayer({ ...newPlayer, image: e.target.value })}
          required
        />
        <button type="submit">Add Player</button>
      </form>

      <div className="players-grid">
        {players.map((player, index) => (
          <div key={index} className="player-card">
            <img src={player.image} alt={player.name} />
            {editingIndex === index ? (
              <div className="edit-player">
                <input
                  type="text"
                  value={editPlayer.name}
                  onChange={(e) =>
                    setEditPlayer({ ...editPlayer, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editPlayer.image}
                  onChange={(e) =>
                    setEditPlayer({ ...editPlayer, image: e.target.value })
                  }
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditingIndex(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <div className="player-name">{player.name}</div>
                <button onClick={() => handleEdit(index)}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
