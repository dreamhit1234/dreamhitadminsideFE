import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddWallet.scss";

export default function AddWallet() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");

  // ✅ Load users from backend
  useEffect(() => {
    axios
      .get("http://localhost:8080/wallet/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error loading users:", err));
  }, []);

  // ✅ Add Amount
  const handleAdd = async () => {
    if (!selectedUser || !amount) return;
    try {
      await axios.post("http://localhost:8080/wallet/add", {
        username: selectedUser,
        amount: parseFloat(amount),
      });
      reloadUsers();
      setAmount("");
    } catch (err) {
      console.error("Error adding amount:", err);
    }
  };

  // ✅ Remove Amount
  const handleRemove = async () => {
    if (!selectedUser || !amount) return;
    try {
      await axios.post("http://localhost:8080/wallet/remove", {
        username: selectedUser,
        amount: parseFloat(amount),
      });
      reloadUsers();
      setAmount("");
    } catch (err) {
      console.error("Error removing amount:", err);
    }
  };

  const reloadUsers = () => {
    axios
      .get("http://localhost:8080/wallet/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error loading users:", err));
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
                {u.name} ({u.username}) : ₹{u.amount || 0}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
