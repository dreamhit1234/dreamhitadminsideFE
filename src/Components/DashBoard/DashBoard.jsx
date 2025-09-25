import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DashBoard.scss";

import CreateUser from "../DashBoardComponents/UserCreate/UserCreate";
import Transactions from "../DashBoardComponents/Transactions/Transactions";
import CreateMatch from "../DashBoardComponents/CreateMatch/CreateMatch";
import TopStories from "../DashBoardComponents/TopStories/TopStories";
import AddWallet from "../DashBoardComponents/AddWallet/AddWallet";
import CreatePlayers from "../DashBoardComponents/CreatePlayers/CreatePlayers";
import CreateSquads from "../DashBoardComponents/CreatePlayersList/CreateSquad";
import LeaderBoardAdmin from "../DashBoardComponents/LeaderBoard/LeaderBoard";
import AdminAuction from "../DashBoardComponents/AdminAuction/AdminAuction";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stories, setStories] = useState([]);
  const [players, setPlayers] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(false);

  // Fetch users
  useEffect(() => {
    axios.get("http://localhost:8080/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch matches
  useEffect(() => {
    axios.get("http://localhost:8080/matches")
      .then(res => setMatches(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleUserCreated = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-buttons">
        <button onClick={() => setShowCreateUser(true)}>Create User</button>
        <button onClick={() => setActiveTab("users")}>Users</button>
        <button onClick={() => setActiveTab("transactions")}>Transactions</button>
        <button onClick={() => setActiveTab("createMatch")}>Create Matches</button>
        <button onClick={() => setActiveTab("topStories")}>Top Stories</button>
        <button onClick={() => setActiveTab("addwallet")}>Add Wallet</button>
        <button onClick={() => setActiveTab("createPlayers")}>Create Players</button>
        <button onClick={() => setActiveTab("createPlayersList")}>Create Squad</button>
        <button onClick={() => setActiveTab("leaderboard")}>LeaderBoard</button>
        <button onClick={() => setActiveTab("auction")}>Admin Auction</button>
      </div>

      {/* Users Table */}
      {activeTab === "users" && (
        <div className="users-table">
          <h3>Users</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Username</th>
                <th>Password</th>
                <th>Withdraw Password</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.mobile}</td>
                  <td>{u.username}</td>
                  <td>{u.password}</td>
                  <td>{u.withdrawPassword}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transactions */}
      {activeTab === "transactions" && <Transactions onClose={() => setActiveTab(null)} />}

      {/* Create Match */}
      {activeTab === "createMatch" && (
        <div className="create-match-page">
          <h3>Create Matches</h3>
          <CreateMatch matches={matches} setMatches={setMatches} />
        </div>
      )}

      {/* Top Stories */}
      {activeTab === "topStories" && (
        <div className="top-stories-page">
          <h3>Top Stories</h3>
          <TopStories stories={stories} setStories={setStories} />
        </div>
      )}

      {/* Add Wallet */}
      {activeTab === "addwallet" && (
        <div className="add-wallet-page">
          <h3>Add / Remove Wallet Amount</h3>
          <AddWallet users={users} setUsers={setUsers} />
        </div>
      )}

      {/* Create Players */}
      {activeTab === "createPlayers" && (
        <div className="create-players-page">
          <h3>Create Players</h3>
          <CreatePlayers players={players} setPlayers={setPlayers} />
        </div>
      )}

      {/* Create Squad */}
      {activeTab === "createPlayersList" && (
        <div className="create-players-list-page">
          <h3>Create Squad</h3>
          <CreateSquads matches={matches} allPlayers={players} />
        </div>
      )}

      {/* LeaderBoard */}
      {activeTab === "leaderboard" && (
        <div className="leaderboard-page">
          <h3>LeaderBoard</h3>
          <LeaderBoardAdmin players={players} />
        </div>
      )}

      {/* Admin Auction */}
      {activeTab === "auction" && (
        <div className="admin-auction-page">
          <h3>Admin Auction</h3>
          <AdminAuction />
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUser && (
        <CreateUser
          onUserCreated={handleUserCreated}
          existingUsers={users}
          onClose={() => setShowCreateUser(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
