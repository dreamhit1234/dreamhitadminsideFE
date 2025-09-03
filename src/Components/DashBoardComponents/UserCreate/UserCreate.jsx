import React, { useState } from "react";
import "./UserCreate.scss";

const CreateUser = ({ onUserCreated, existingUsers, onClose }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState(null);

  const handleSubmit = () => {
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
    onUserCreated(user);

    setCredentials(user);
    setName("");
    setMobile("");
    setError("");
  };

  const copyAllCredentials = () => {
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
            {error && <p className="error">{error}</p>}

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <button onClick={handleSubmit}>Generate ID</button>
            <button className="close-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      )}

      {credentials && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>User Created Successfully!</h3>
            <div className="credentials">
              <p>Username: {credentials.username}</p>
              <p>Password: {credentials.password}</p>
              <p>Withdraw Password: {credentials.withdrawPassword}</p>

              <button onClick={copyAllCredentials} className="copy-all-btn">
                Copy All
              </button>

              <a
                href={`https://wa.me/${credentials.mobile}`}
                target="_blank"
                rel="noreferrer"
              >
                Send via WhatsApp
              </a>
            </div>
            <button
              className="close-btn"
              onClick={() => setCredentials(null) || onClose()}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateUser;
