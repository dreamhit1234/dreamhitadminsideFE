import React, { useState } from "react";
import "./AddWallet.scss";

export default function AddWallet({ users, setUsers }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    if (!selectedUser || !amount) return;
    const updated = users.map((user) => {
      if (user.username === selectedUser) {
        return { ...user, wallet: (user.wallet || 0) + parseFloat(amount) };
      }
      return user;
    });
    setUsers(updated);
    setAmount("");
  };

  const handleRemove = () => {
    if (!selectedUser || !amount) return;
    const updated = users.map((user) => {
      if (user.username === selectedUser) {
        const newAmount = (user.wallet || 0) - parseFloat(amount);
        return { ...user, wallet: newAmount >= 0 ? newAmount : 0 };
      }
      return user;
    });
    setUsers(updated);
    setAmount("");
  };

  return (
    <div className="add-wallet">
      <h3>Manage Wallet</h3>

      <div className="wallet-form">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((u, i) => (
            <option key={i} value={u.username}>
              {u.name} ({u.username})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="wallet-buttons">
          <button onClick={handleAdd}>Add Amount</button>
          <button onClick={handleRemove}>Remove Amount</button>
        </div>
      </div>

      <div className="wallet-list">
        <h4>Current Wallets</h4>
        {users.length === 0 ? (
          <p>No users available.</p>
        ) : (
          <ul>
            {users.map((u, i) => (
              <li key={i}>
                {u.name} ({u.username}) : ₹{u.wallet || 0}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
