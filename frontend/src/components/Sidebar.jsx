import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, FilePlus2, ClipboardList, BarChart3, ShieldCheck, Sparkles, CircleHelp } from "lucide-react";

const studentLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/submit", label: "Submit a complaint", icon: FilePlus2 },
  { to: "/my-complaints", label: "My complaints", icon: ClipboardList },
];
const adminLinks = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/complaints", label: "Manage complaints", icon: ClipboardList },
  { to: "/admin/analytics", label: "Analytics & insights", icon: BarChart3 },
];

export default function Sidebar({ mobileOpen = false, onNavigate = () => {} }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const links = isAdmin ? adminLinks : studentLinks;
  const initials = (user?.full_name || user?.name || user?.email || (isAdmin ? "Admin" : "Student"))
    .split(/[ @._-]/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join("");
  return (
    <aside className={`app-sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <NavLink to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="brand-lockup" onClick={onNavigate}>
        <span className="brand-mark"><ShieldCheck size={22} /></span>
        <span className="brand-copy"><strong>CampusMind<span>AI</span></strong><small>Campus, made better</small></span>
      </NavLink>
      <div className="sidebar-workspace"><span className="workspace-dot" /><span>{isAdmin ? "Administration" : "Student workspace"}</span></div>
      <div className="sidebar-label">WORKSPACE</div>
      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onNavigate}><Icon size={19} strokeWidth={1.9} /><span>{label}</span>{label === "Manage complaints" && <span className="nav-arrow">↗</span>}</NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-tip"><div className="tip-icon"><Sparkles size={17} /></div><strong>{isAdmin ? "Campus intelligence" : "Your voice matters"}</strong><p>{isAdmin ? "Turn campus feedback into meaningful action." : "Help make your campus safer, cleaner and better."}</p></div>
        <div className="sidebar-profile"><div className="avatar">{initials || "U"}</div><div className="profile-copy"><strong>{user?.full_name || user?.name || (isAdmin ? "Administrator" : "Student")}</strong><span>{user?.email || (isAdmin ? "Admin account" : "Student account")}</span></div><span className="profile-role">{isAdmin ? "ADMIN" : "STUDENT"}</span></div>
      </div>
    </aside>
  );
}
