import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import ListFood from "./components/ListFood";
import Listings from "./components/Listings";
import Notifications from "./components/Notifications";
import BottomNav from "./components/BottomNav";
import logo from "./assets/logo.png";

function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    if (page === "home") return <Dashboard />;
    if (page === "add") return <ListFood />;
    if (page === "listings") return <Listings />;
    if (page === "notifications") return <Notifications />;
  };

  return (
    <div className="app">
      <header className="header">
        <img src={logo} className="logo" alt="Feedback logo" />
        <h1>Feedback</h1>
      </header>

      <main className="content">{renderPage()}</main>

      <BottomNav setPage={setPage} />
    </div>
  );
}

export default App;
