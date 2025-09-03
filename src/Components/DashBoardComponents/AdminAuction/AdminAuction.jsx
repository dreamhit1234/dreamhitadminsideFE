import React, { useState, useEffect, useRef } from "react";
import "./AdminAuction.scss";

export default function AdminAuction() {
  const matchInfo = { name: "IND vs PAK", type: "ODI", count: "Auction" };

  const [allPlayers, setAllPlayers] = useState([
    { id: 1, name: "Player 1", img: "https://via.placeholder.com/50", sold: false },
    { id: 2, name: "Player 2", img: "https://via.placeholder.com/50", sold: false },
    { id: 3, name: "Player 3", img: "https://via.placeholder.com/50", sold: false },
    { id: 4, name: "Player 4", img: "https://via.placeholder.com/50", sold: false },
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [chat, setChat] = useState([]);
  const [popup, setPopup] = useState(null);
  const chatEndRef = useRef(null);

  const footerButtons = ["1", "2", "Any One", "Last Chance", "All Drop", "Sold", "Unsold"];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  const toggleDropdown = (type) => {
    setActiveDropdown((prev) => (prev === type ? null : type));
  };

  const handlePlayerSelect = (p) => {
    setCurrentPlayer(p);
    setChat([{ user: "System", message: `Auction started for ${p.name}`, time: getTime() }]);
  };

  const getTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  const handleAdminReply = (replyType) => {
    if (!currentPlayer) return;
    const timeStr = getTime();

    if (replyType === "Sold") {
      const buyerName = "User1";
      const amount = 500;
      setPopup({ type: "Sold", ...currentPlayer, buyer: buyerName, price: amount });

      setChat([...chat, { user: "Admin", message: `Sold to ${buyerName} ₹${amount}`, time: timeStr }]);

      setAllPlayers((prev) =>
        prev.map((pl) => (pl.id === currentPlayer.id ? { ...pl, sold: true } : pl))
      );
      return;
    }

    if (replyType === "Unsold") {
      setPopup({ type: "Unsold", ...currentPlayer });
      setChat([...chat, { user: "Admin", message: "Unsold", time: timeStr }]);
      return;
    }

    setChat([...chat, { user: "Admin", message: replyType, time: timeStr }]);
  };

  const closePopup = () => {
    setPopup(null);
    setCurrentPlayer(null);
    setChat([]);
  };

  return (
    <div className="auction-admin-view">
      {/* Header */}
      <div className="auction-header">
        <div className="match-info">
          <span className="match-name">{matchInfo.name}</span>
          <span className="match-type">
            {matchInfo.type}, {matchInfo.count}
          </span>
        </div>
        <div className="wallet">Admin Panel</div>
      </div>

      {/* Tabs */}
      <div className="auction-buttons">
        <button
          className={activeDropdown === "players" ? "active" : ""}
          onClick={() => toggleDropdown("players")}
        >
          All Players
        </button>
        <button
          className={activeDropdown === "sold" ? "active" : ""}
          onClick={() => toggleDropdown("sold")}
        >
          Sold Players
        </button>
      </div>

      {/* All Players */}
      {activeDropdown === "players" && (
        <div className="dropdown-container">
          <div className="player-scroll">
            {allPlayers.map((p) => (
              <div
                key={p.id}
                className={`player-card ${currentPlayer?.id === p.id ? "current" : ""}`}
                onClick={() => handlePlayerSelect(p)}
              >
                <img src={p.img} alt={p.name} />
                <span>{p.name}</span>
                {p.sold && <span className="sold-label">Sold</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sold Players */}
      {activeDropdown === "sold" && (
        <div className="dropdown-container">
          <div className="player-scroll">
            {allPlayers
              .filter((p) => p.sold)
              .map((p) => (
                <div className="player-card" key={p.id}>
                  <img src={p.img} alt={p.name} />
                  <span>{p.name}</span>
                  <span>Buyer: User1</span>
                  <span>₹ 500</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Current Player */}
      {currentPlayer && (
        <div className="current-player">
          <div className="player-card">
            <img src={currentPlayer.img} alt={currentPlayer.name} />
            <span>{currentPlayer.name}</span>
          </div>
        </div>
      )}

      {/* Chatbox */}
      <div className="chatbox">
        {chat.length === 0 && <div className="empty-chat">No messages yet</div>}
        {chat.map((c, i) => (
          <div
            key={i}
            className={`chat-message ${c.user === "Admin" ? "right" : "left"} ${
              c.user === "System" ? "system" : ""
            }`}
          >
            {c.user !== "System" && <div className="user-icon">{c.user[0]}</div>}
            <div className="chat-content">
              <div className="chat-amount">{c.message}</div>
              <div className="chat-time">{c.time}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Footer Buttons */}
      <div className="footer-bid-buttons">
        {footerButtons.map((btn) => (
          <button key={btn} onClick={() => handleAdminReply(btn)}>
            {btn}
          </button>
        ))}
      </div>

      {/* Popup */}
      {popup && (
        <div className="sold-popup">
          <div className="popup-content">
            <h4>{popup.type} Player</h4>
            <img src={popup.img} alt={popup.name} />
            <p>Name: {popup.name}</p>
            {popup.type === "Sold" && <p>Buyer: {popup.buyer}</p>}
            {popup.type === "Sold" && <p>Amount: ₹ {popup.price}</p>}
            <button onClick={closePopup}>Next Player</button>
          </div>
        </div>
      )}
    </div>
  );
}
