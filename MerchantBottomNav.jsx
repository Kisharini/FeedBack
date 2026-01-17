function BottomNav({ setPage }) {
  return (
    <nav className="bottom-nav">
      <button onClick={() => setPage("home")}>🏠</button>
      <button onClick={() => setPage("add")}>➕</button>
      <button onClick={() => setPage("listings")}>📋</button>
      <button onClick={() => setPage("notifications")}>🔔</button>
    </nav>
  );
}

export default BottomNav;
