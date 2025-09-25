import React, { useState } from "react";
import axios from "axios";
import "./UserCreate.scss"; // ✅ include the SCSS file

const CreateUser = ({ onUserCreated, existingUsers, onClose }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState(null);

  const handleSubmit = async () => {
    if (!name || !mobile) {
      setError("Please enter both Name and Mobile number");
      return;
    }
    if (existingUsers.some(u => u.mobile === mobile)) {
      setError("Mobile number already exists");
      return;
    }

    const username = name.slice(0, 3).toLowerCase() + mobile.slice(-3);
    const password = "PWD" + Math.floor(1000 + Math.random() * 9000);
    const withdrawPassword = "WD" + Math.floor(1000 + Math.random() * 9000);

    const user = { name, mobile, username, password, withdrawPassword };

    try {
      const res = await axios.post("http://localhost:8080/users", user);
      setCredentials(res.data);
      onUserCreated(res.data);
      setName("");
      setMobile("");
      setError("");
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Error creating user";
      setError(msg);
    }
  };

  const copyAllCredentials = () => {
    if (!credentials) return;
    const allText = `Username: ${credentials.username}\nPassword: ${credentials.password}\nWithdraw Password: ${credentials.withdrawPassword}`;
    navigator.clipboard.writeText(allText);
    alert("All credentials copied!");
  };

  return (
    <div className="create-user-component">
      {!credentials && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Create User</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} />
            <button className="create-user-btn" onClick={handleSubmit}>Generate ID</button>
            <button className="close-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      )}

      {credentials && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>User Created</h3>
            <div className="credentials">
              <p>Username: {credentials.username}</p>
              <p>Password: {credentials.password}</p>
              <p>Withdraw Password: {credentials.withdrawPassword}</p>
              <a href={`https://wa.me/${credentials.mobile}`} target="_blank" rel="noreferrer">
                Send via WhatsApp
              </a>
            </div>
            <button onClick={copyAllCredentials} className="create-user-btn">Copy All</button>
            <button className="close-btn" onClick={() => { setCredentials(null); onClose(); }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateUser;
