
import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import CreateUser from "../DashBoardComponents/UserCreate/UserCreate";
import Transactions from "../DashBoardComponents/Transactions/Transactions";
import CreateMatch from "../DashBoardComponents/CreateMatch/CreateMatch";
import TopStories from "../DashBoardComponents/TopStories/TopStories";
import AddWallet from "../DashBoardComponents/AddWallet/AddWallet";
import CreatePlayers from "../DashBoardComponents/CreatePlayers/CreatePlayers";
import CreateSquads from "../DashBoardComponents/CreatePlayersList/CreateSquad";
import LeaderBoardAdmin from "../DashBoardComponents/LeaderBoard/LeaderBoard";
import AdminAuction from "../DashBoardComponents/AdminAuction/AdminAuction";

import "./DashBoard.scss";

const AdminDashboard = () => {
  // localStorage లో last activeTab save చేసి, refresh అయినా retain అవ్వడానికి
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem("activeTab") || null
  );

  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stories, setStories] = useState([]);
  const [players, setPlayers] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(false);

  // activeTab మారినప్పుడల్లా localStorage లో update అవుతుంది
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);

  // Users data fetch
  useEffect(() => {
    axios
      .get("http://localhost:8080/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Users Fetch Error:", err));
  }, []);

  // Matches data fetch
  useEffect(() => {
    axios
      .get("http://localhost:8080/matches")
      .then((res) => setMatches(res.data))
      .catch((err) => console.error("Matches Fetch Error:", err));
  }, []);

  const handleUserCreated = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
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
                <th>Wallet</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.mobile}</td>
                  <td>{u.username}</td>
                  <td>{u.password}</td>
                  <td>{u.withdrawPassword}</td>
                  <td>{u.amount ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transactions */}
      {activeTab === "transactions" && (
        <Transactions onClose={() => setActiveTab(null)} />
      )}

      {/* Create Match */}
      {activeTab === "createMatch" && (
        <CreateMatch matches={matches} setMatches={setMatches} />
      )}

      {/* Top Stories */}
      {activeTab === "topStories" && (
        <TopStories stories={stories} setStories={setStories} />
      )}

      {/* Add Wallet */}
      {activeTab === "addwallet" && (
        <AddWallet users={users} setUsers={setUsers} />
      )}

      {/* Create Players */}
      {activeTab === "createPlayers" && (
        <CreatePlayers players={players} setPlayers={setPlayers} />
      )}

      {/* Create Squad */}
      {activeTab === "createPlayersList" && (
        <CreateSquads matches={matches} allPlayers={players} />
      )}

      {/* LeaderBoard */}
      {activeTab === "leaderboard" && (
        <LeaderBoardAdmin players={players} />
      )}

      {/* Admin Auction */}
      {activeTab === "auction" && <AdminAuction />}

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

