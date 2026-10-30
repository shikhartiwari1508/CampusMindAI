import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Search, LogOut, Menu, ChevronDown, Sun } from "lucide-react";

const titles = {
  "/dashboard": ["Overview", "Your campus at a glance"],
  "/submit": ["Submit a complaint", "Tell us what needs attention"],
  "/my-complaints": ["My complaints", "Track the progress of your submissions"],
  "/admin/dashboard": ["Admin overview", "Monitor campus issues and resolution"],
  "/admin/complaints": ["Manage complaints", "Review, prioritize and resolve issues"],
  "/admin/analytics": ["Analytics & insights", "Understand the trends behind campus feedback"],
};
export default function Navbar({ onMenuClick = () => {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const title = titles[location.pathname] || ["CampusMindAI", "Campus support workspace"];
  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(user?.role === "admin" ? "/admin/complaints" : "/my-complaints", { state: { search: search.trim() } });
    }
  };
  const handleLogout = () => { logout(); navigate("/login"); };
  return <header className="app-topbar">
    <div className="topbar-title-wrap"><button className="icon-button mobile-menu-button" onClick={onMenuClick} aria-label="Toggle navigation"><Menu size={20} /></button><div><div className="breadcrumb">WORKSPACE <span>/</span> <b>{title[0]}</b></div><p className="topbar-subtitle">{title[1]}</p></div></div>
    <div className="topbar-actions">
      <label className="global-search"><Search size={17} /><input aria-label="Search complaints" placeholder="Search complaints..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch} /><kbd>↵</kbd></label>
      <button className="icon-button notification-button" title="Notifications" onClick={() => window.alert("You’re all caught up. New complaint updates will appear here.")}><Bell size={19} /><span className="notification-dot" /></button>
      <div className="topbar-divider" />
      <button className="topbar-user" onClick={() => setMenuOpen(v => !v)}><span className="avatar avatar-small">{(user?.full_name || user?.name || user?.email || "U").split(/[ @._-]/).filter(Boolean).slice(0,2).map(s=>s[0]?.toUpperCase()).join("")}</span><span className="topbar-user-copy"><strong>{user?.full_name || user?.name || (user?.role === "admin" ? "Administrator" : "Student")}</strong><small>{user?.role === "admin" ? "Administrator" : "Student account"}</small></span><ChevronDown size={15} /></button>
      {menuOpen && <div className="user-dropdown"><button onClick={handleLogout}><LogOut size={16} /> Sign out</button></div>}
    </div>
  </header>;
}
