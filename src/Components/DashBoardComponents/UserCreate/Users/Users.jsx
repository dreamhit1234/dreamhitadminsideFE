import React, { useState } from "react";
import "./Users.scss";

const Users = ({ users, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.mobile.includes(searchTerm)
  );

  return (
    <div className="users-component">
      {/* Top Row */}
      <div className="users-top-row">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <button className="close-btn" onClick={onBack}>
          ✕ Close
        </button>
      </div>

      {/* Title & Search */}
      <div className="title-search-row">
        <h2>Users</h2>
        <input
          type="text"
          placeholder="Search by ID or Mobile"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>ID</th>
              <th>Password</th>
              <th>Withdraw Password</th>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Wallet Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "even-row" : "odd-row"}>
                <td>{idx + 1}</td>
                <td>{user.username}</td>
                <td>{user.password}</td>
                <td>{user.withdrawPassword}</td>
                <td>{user.name}</td>
                <td>{user.mobile}</td>
                <td>{user.amount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
