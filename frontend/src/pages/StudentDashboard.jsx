import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CirclePlus, ClipboardList, Clock3, CheckCircle2, CircleAlert, RefreshCw, Sparkles, MapPin, CalendarDays, ChevronRight, Activity } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import axios from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const COLORS = ["#6D5CE8", "#F4B740", "#20B889", "#E47D70"];
const cleanStatus = s => String(s || "OPEN").toUpperCase();
const statusLabel = s => ({ OPEN: "Open", IN_PROGRESS: "In progress", RESOLVED: "Resolved", REJECTED: "Rejected" }[cleanStatus(s)] || s);
const dateLabel = value => value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—";
const StatCard = ({ icon: Icon, label, value, tone, note }) => <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20} /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>;

export default function StudentDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    let alive = true;
    axios.get("/complaints/").then(res => { if (alive) setComplaints(Array.isArray(res.data) ? res.data : []); })
      .catch(err => { if (alive) { const msg = err.response?.data?.detail || "Could not load your complaints. Please try again."; setError(msg); showToast("error", msg); } })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [refreshKey]);
  const counts = useMemo(() => complaints.reduce((a,c) => { a.total++; const s=cleanStatus(c.status); if(s==="OPEN")a.open++; else if(s==="IN_PROGRESS")a.progress++; else if(s==="RESOLVED")a.resolved++; return a; }, {total:0,open:0,progress:0,resolved:0}), [complaints]);
  const pieData = [{name:"Open",value:counts.open},{name:"In progress",value:counts.progress},{name:"Resolved",value:counts.resolved}].filter(d=>d.value>0);
  const activityData = useMemo(() => {
    const days = Array.from({length:7},(_,i)=>{ const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-(6-i)); return { key:d.toDateString(), day:d.toLocaleDateString("en-IN",{weekday:"short"}), complaints:0 }; });
    complaints.forEach(c=>{const d=new Date(c.created_at); const item=days.find(x=>x.key===new Date(d.getFullYear(),d.getMonth(),d.getDate()).toDateString()); if(item)item.complaints++;});
    return days;
  },[complaints]);
  const recent = [...complaints].sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0)).slice(0,5);
  const firstName = (user?.full_name || user?.name || "there").trim().split(/\s+/)[0];
  return <div className="dashboard-page">
    <section className="welcome-banner"><div className="welcome-orb welcome-orb-one"/><div className="welcome-orb welcome-orb-two"/><div className="welcome-content"><div className="eyebrow light-eyebrow"><Sparkles size={14}/> YOUR CAMPUS, YOUR VOICE</div><h1>Good to see you, {firstName} <span className="wave">✦</span></h1><p>Small reports can make a big difference. Here’s what’s happening with your campus feedback.</p><div className="welcome-actions"><Link className="button button-white" to="/submit"><CirclePlus size={17}/> Submit a complaint</Link><Link className="button button-glass" to="/my-complaints">Track my complaints <ArrowUpRight size={16}/></Link></div></div><div className="welcome-art"><div className="art-ring ring-one"/><div className="art-ring ring-two"/><div className="art-center"><Activity size={35}/></div><span className="art-chip chip-top"><span/> Campus feedback</span><span className="art-chip chip-bottom"><CheckCircle2 size={14}/> Every voice counts</span></div></section>
    <div className="section-heading"><div><div className="eyebrow">YOUR OVERVIEW</div><h2>Complaint summary</h2><p>A quick look at your reported campus issues.</p></div><button className="button button-outline button-sm" onClick={()=>{setLoading(true);setError("");setRefreshKey(v=>v+1)}}><RefreshCw size={15}/> Refresh</button></div>
    {error && <div className="inline-error"><CircleAlert size={18}/><span>{error}</span><button onClick={()=>{setLoading(true);setError("");setRefreshKey(v=>v+1)}}>Try again</button></div>}
    <div className="stats-grid">
      <StatCard icon={ClipboardList} label="Total complaints" value={loading?"—":counts.total} tone="purple" note="All submissions"/>
      <StatCard icon={CircleAlert} label="Open" value={loading?"—":counts.open} tone="amber" note="Awaiting review"/>
      <StatCard icon={Clock3} label="In progress" value={loading?"—":counts.progress} tone="blue" note="Being worked on"/>
      <StatCard icon={CheckCircle2} label="Resolved" value={loading?"—":counts.resolved} tone="green" note="Marked complete"/>
    </div>
    <div className="dashboard-grid charts-row">
      <section className="panel chart-panel"><div className="panel-heading"><div><h3>Complaint activity</h3><p>Your submissions over the last 7 days</p></div><span className="panel-icon"><Activity size={18}/></span></div><div className="chart-area">{loading?<div className="loading-state">Loading activity…</div>:<ResponsiveContainer width="100%" height="100%"><AreaChart data={activityData} margin={{top:10,right:8,left:-24,bottom:0}}><defs><linearGradient id="studentActivityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7867EE" stopOpacity={0.25}/><stop offset="95%" stopColor="#7867EE" stopOpacity={0.01}/></linearGradient></defs><CartesianGrid stroke="#EEF0F6" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:"#8C91A5",fontSize:12}} dy={10}/><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill:"#8C91A5",fontSize:12}}/><Tooltip contentStyle={{borderRadius:12,border:"1px solid #E9EAF2",boxShadow:"0 8px 24px #2222"}}/><Area type="monotone" dataKey="complaints" name="Complaints" stroke="#7867EE" strokeWidth={2.5} fill="url(#studentActivityFill)" activeDot={{r:5}}/></AreaChart></ResponsiveContainer>}</div></section>
      <section className="panel chart-panel"><div className="panel-heading"><div><h3>Status breakdown</h3><p>Where your complaints stand</p></div><span className="panel-icon panel-icon-green"><Activity size={18}/></span></div>{!loading && complaints.length===0?<div className="empty-chart"><div className="empty-icon"><ClipboardList size={24}/></div><strong>No complaints yet</strong><p>Your status summary will appear after your first submission.</p><Link to="/submit" className="text-link">Create your first complaint <ChevronRight size={15}/></Link></div>:<><div className="donut-wrap"><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={pieData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={78} paddingAngle={4} stroke="none">{pieData.map((entry,i)=><Cell key={entry.name} fill={COLORS[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{loading?"—":counts.total}</strong><span>Total reports</span></div></div><div className="legend-list">{[{name:"Open",value:counts.open,color:COLORS[1]},{name:"In progress",value:counts.progress,color:COLORS[0]},{name:"Resolved",value:counts.resolved,color:COLORS[2]}].map(x=><div className="legend-row" key={x.name}><span className="legend-name"><i style={{background:x.color}}/>{x.name}</span><strong>{loading?"—":x.value}</strong></div>)}</div></>}</section>
    </div>
    <section className="panel recent-panel"><div className="panel-heading"><div><h3>Recent complaints</h3><p>Stay up to date with your latest reports</p></div><Link className="text-link" to="/my-complaints">View all <ChevronRight size={16}/></Link></div>{loading?<div className="loading-state">Loading your complaints…</div>:recent.length===0?<div className="empty-table"><div className="empty-icon"><ClipboardList size={25}/></div><strong>Your campus can be better</strong><p>You haven’t submitted a complaint yet. Tell us what needs attention.</p><Link to="/submit" className="button button-primary"><CirclePlus size={16}/> Submit first complaint</Link></div>:<div className="table-scroll"><table className="modern-table"><thead><tr><th>Complaint</th><th>Category</th><th>Submitted</th><th>Status</th><th></th></tr></thead><tbody>{recent.map(c=><tr key={c.id}><td><div className="complaint-cell"><span className="complaint-mini-icon"><ClipboardList size={16}/></span><div><strong>{c.title}</strong><small>Ticket #{String(c.public_ticket_id||c.id).slice(0,8)}</small></div></div></td><td>{c.category||"General"}</td><td><span className="muted-cell"><CalendarDays size={14}/>{dateLabel(c.created_at)}</span></td><td><span className={`status-pill status-${cleanStatus(c.status).toLowerCase()}`}><i/>{statusLabel(c.status)}</span></td><td><Link className="table-action" to={`/complaint/${c.id}`}>Details <ChevronRight size={14}/></Link></td></tr>)}</tbody></table></div>}</section>
    <div className="bottom-note"><div className="note-icon"><MapPin size={18}/></div><div><strong>Building a better campus starts here.</strong><p>Each complaint is reviewed and prioritized to help the right people take action.</p></div><Link to="/submit" className="note-action">Share feedback <ArrowUpRight size={15}/></Link></div>
  </div>;
}
