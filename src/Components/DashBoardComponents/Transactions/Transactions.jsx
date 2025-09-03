import React, { useState } from "react";
import "./Transactions.scss";

const Transactions = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("deposit");
  const [filter, setFilter] = useState("all");

  const [depositData, setDepositData] = useState([
    { id: 1, userid: "USR123", amount: 500, utr: "UTR123", image: "https://pbs.twimg.com/media/GiYPyLsXIAAADXT.jpg", status: null },
  ]);

  const [withdrawData, setWithdrawData] = useState([
    { id: 1, userid: "USR456", amount: 300, bank: { holder: "John Doe", account: "1234567890", ifsc: "IFSC001" }, status: null },
  ]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [modal, setModal] = useState(null);
  const [bankModal, setBankModal] = useState(null); // new state for bank modal

  const handleAccept = (txn, type) => {
    if (type === "deposit") {
      setDepositData(prev => prev.map(d => (d.id === txn.id ? { ...d, status: "accepted" } : d)));
      setModal({ msg: `Deposit Successful!\nUserID: ${txn.userid}\nAmount: ${txn.amount}` });
    } else {
      setWithdrawData(prev => prev.map(w => (w.id === txn.id ? { ...w, status: "accepted" } : w)));
      setModal({ msg: `Withdraw Done!\nUserID: ${txn.userid}\nAmount: ${txn.amount}` });
    }
  };

  const handleReject = (txn, type, reason) => {
    if (type === "deposit") {
      setDepositData(prev => prev.map(d => (d.id === txn.id ? { ...d, status: "rejected", reason } : d)));
    } else {
      setWithdrawData(prev => prev.map(w => (w.id === txn.id ? { ...w, status: "rejected", reason } : w)));
    }
    setModal({ msg: `Rejected!\nReason: ${reason}\nUserID: ${txn.userid}` });
  };

  const filteredData = data => {
    if (filter === "accepted") return data.filter(d => d.status === "accepted");
    if (filter === "rejected") return data.filter(d => d.status === "rejected");
    return data;
  };

  return (
    <div className="transactions">
      <div className="actions-row">
        <button className={`deposit ${activeTab === "deposit" ? "active" : ""}`} onClick={() => setActiveTab("deposit")}>Deposit</button>
        <button className={`withdraw ${activeTab === "withdraw" ? "active" : ""}`} onClick={() => setActiveTab("withdraw")}>Withdraw</button>
        <select onChange={e => setFilter(e.target.value)} value={filter}>
          <option value="all">All</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Deposit Table */}
      {activeTab === "deposit" && (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Amount</th>
              <th>UTR Number</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData(depositData).map(txn => (
              <tr key={txn.id}>
                <td>{txn.userid}</td>
                <td>{txn.amount}</td>
                <td>{txn.utr}</td>
                <td><button className="view-btn" onClick={() => setSelectedImage(txn.image)}>View</button></td>
                <td className="actions">
                  <button className="accept-btn" onClick={() => handleAccept(txn, "deposit")}>Accept</button>
                  <button className="reject-btn" onClick={() => handleReject(txn, "deposit", "Fake Payment")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Withdraw Table */}
      {activeTab === "withdraw" && (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Amount</th>
              <th>Bank Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData(withdrawData).map(txn => (
              <tr key={txn.id}>
                <td>{txn.userid}</td>
                <td>{txn.amount}</td>
                <td><button className="view-btn" onClick={() => setBankModal(txn.bank)}>View</button></td>
                <td className="actions">
                  <button className="accept-btn" onClick={() => handleAccept(txn, "withdraw")}>Accept</button>
                  <button className="reject-btn" onClick={() => handleReject(txn, "withdraw", "Bank Issue")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal">
          <div className="modal-content">
            <img src={selectedImage} alt="Payment Screenshot" />
            <button onClick={() => setSelectedImage(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Success/Reject Modal */}
      {modal && (
        <div className="modal">
          <div className="modal-content">
            <p style={{ whiteSpace: "pre-line" }}>{modal.msg}</p>
            <button onClick={() => setModal(null)}>OK</button>
          </div>
        </div>
      )}

      {/* Bank Details Modal */}
      {bankModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Bank Details</h3>
            <p>Holder: {bankModal.holder}</p>
            <p>Account: {bankModal.account}</p>
            <p>IFSC: {bankModal.ifsc}</p>
            <button onClick={() => setBankModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
