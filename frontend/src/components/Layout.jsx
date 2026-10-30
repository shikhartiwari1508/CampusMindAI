import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
      <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      <div className="app-main">
        <Navbar onMenuClick={() => setMobileOpen(v => !v)} />
        <main className="app-content">{children}</main>
        <footer className="app-footer"><span>© {new Date().getFullYear()} CampusMindAI</span><span>Built for a better campus <span className="footer-heart">✦</span></span></footer>
      </div>
    </div>
  );
}
