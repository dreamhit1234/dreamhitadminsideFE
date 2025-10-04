import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Transactions.scss";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("deposit");
  const [filter, setFilter] = useState("pending");
  const [depositData, setDepositData] = useState([]);
  const [withdrawData, setWithdrawData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modal, setModal] = useState(null);
  const [bankModal, setBankModal] = useState(null);

  useEffect(() => {
    fetchDeposits();
    fetchWithdrawals();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await axios.get("http://localhost:8080/deposits");
      setDepositData(res.data || []);
    } catch (err) {
      console.error("Error fetching deposits:", err);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get("http://localhost:8080/withdrawals");
      setWithdrawData(res.data || []);
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
    }
  };

  const handleAccept = async (txn, type) => {
    try {
      const url =
        type === "deposit"
          ? `http://localhost:8080/deposits/${txn.id}`
          : `http://localhost:8080/withdrawals/${txn.id}`;

      await axios.put(url, { status: "accepted" });

      setModal({
        msg: `${
          type === "deposit" ? "Deposit" : "Withdrawal"
        } Successful!\nUserID: ${txn.userId}\nAmount: ₹${txn.amount}`,
      });

      if (type === "deposit") {
        setDepositData((prev) =>
          prev.map((d) => (d.id === txn.id ? { ...d, status: "accepted" } : d))
        );
      } else {
        setWithdrawData((prev) =>
          prev.map((w) => (w.id === txn.id ? { ...w, status: "accepted" } : w))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (txn, type, reason) => {
    try {
      const url =
        type === "deposit"
          ? `http://localhost:8080/deposits/${txn.id}`
          : `http://localhost:8080/withdrawals/${txn.id}`;

      await axios.put(url, { status: "rejected", reason });

      setModal({
        msg: `Rejected!\nReason: ${reason}\nUserID: ${txn.userId}`,
      });

      if (type === "deposit") {
        setDepositData((prev) =>
          prev.map((d) => (d.id === txn.id ? { ...d, status: "rejected" } : d))
        );
      } else {
        setWithdrawData((prev) =>
          prev.map((w) => (w.id === txn.id ? { ...w, status: "rejected" } : w))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = (data) => {
    if (filter === "accepted")
      return data.filter((d) => d.status === "accepted");
    if (filter === "rejected")
      return data.filter((d) => d.status === "rejected");
    return data.filter((d) => d.status === "pending");
  };

  return (
    <div className="transactions">
      {/* Tabs + Filter */}
      <div className="actions-row">
        <button
          className={activeTab === "deposit" ? "deposit active" : "deposit"}
          onClick={() => setActiveTab("deposit")}
        >
          Deposits
        </button>
        <button
          className={activeTab === "withdraw" ? "withdraw active" : "withdraw"}
          onClick={() => setActiveTab("withdraw")}
        >
          Withdrawals
        </button>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Pending</option>
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
              <th>UTR</th>
              <th>Screenshot</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData(depositData).map((txn) => (
              <tr key={txn.id}>
                <td>{txn.userId}</td>
                <td>{txn.utr}</td>
                <td>
                  {txn.image ? (
                    <button
                      className="view-btn"
                      onClick={() =>
                        setSelectedImage("http://localhost:8080" + txn.image)
                      }
                    >
                      View
                    </button>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>₹{txn.amount}</td>
                <td className="actions">
                  {txn.status === "pending" ? (
                    <>
                      <button
                        className="accept-btn"
                        onClick={() => handleAccept(txn, "deposit")}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleReject(txn, "deposit", "Fake Payment")
                        }
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className={`status-${txn.status}`}>{txn.status}</span>
                  )}
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
              <th>Bank</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData(withdrawData).map((txn) => (
              <tr key={txn.id}>
                <td>{txn.userId}</td>
                <td>₹{txn.amount}</td>
                <td>
                  {txn.bank ? (
                    <button
                      className="view-btn"
                      onClick={() => setBankModal(txn.bank)}
                    >
                      View
                    </button>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="actions">
                  {txn.status === "pending" ? (
                    <>
                      <button
                        className="accept-btn"
                        onClick={() => handleAccept(txn, "withdraw")}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleReject(txn, "withdraw", "Bank Issue")
                        }
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className={`status-${txn.status}`}>{txn.status}</span>
                  )}
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

      {/* Bank Modal */}
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

      {/* Status Modal */}
      {modal && (
        <div className="modal">
          <div className="modal-content">
            <p style={{ whiteSpace: "pre-line" }}>{modal.msg}</p>
            <button onClick={() => setModal(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
