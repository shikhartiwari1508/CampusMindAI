import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Activity, ArrowUpRight, CheckCircle2, Clock3, ClipboardList, CircleAlert, RefreshCw, Sparkles, Users, BarChart3, ChevronRight, CalendarDays } from "lucide-react";
import axios from "../api";
import { useToast } from "../context/ToastContext";

const COLORS = ["#7667E8","#F2B544","#21B88A","#E47D70","#59A6D8"];
const StatCard = ({ icon: Icon, label, value, tone, note }) => <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>;
export default function AdminDashboard() {
  const { showToast } = useToast();
  const [stats,setStats] = useState(null);
  const [complaints,setComplaints] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const [refresh,setRefresh] = useState(0);
  useEffect(()=>{
    let alive=true;
    Promise.all([axios.get("/admin/dashboard"),axios.get("/admin/complaints")]).then(([s,c])=>{
      if(!alive)return;
      setStats(s.data||{});
      setComplaints(Array.isArray(c.data)?c.data:[]);
    }).catch(err=>{if(alive){const msg=err.response?.data?.detail||"Could not load admin data. Check your connection and permissions.";setError(msg);showToast("error",msg);}})
    .finally(()=>alive&&setLoading(false));
    return()=>{alive=false;};
  },[refresh]);
  const total = Number(stats?.total_complaints ?? 0);
  const open = Number(stats?.open_complaints ?? 0);
  const progress = Number(stats?.in_progress_complaints ?? 0);
  const resolved = Number(stats?.resolved_complaints ?? 0);
  const resolutionRate = total ? Math.round(resolved/total*100) : 0;
  const categories = useMemo(()=>Object.entries(stats?.category_distribution||{}).map(([category,count])=>({category,count:Number(count)})).sort((a,b)=>b.count-a.count).slice(0,6),[stats]);
  const buildings = useMemo(()=>Object.entries(stats?.building_distribution||{}).map(([building,count])=>({building,count:Number(count)})).sort((a,b)=>b.count-a.count).slice(0,5),[stats]);
  const latest = [...complaints].sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0)).slice(0,5);
  const urgent = [...complaints].filter(c=>c.status!=="RESOLVED").sort((a,b)=>(Number(b.priority_score)||0)-(Number(a.priority_score)||0)).slice(0,3);
  return <div className="dashboard-page">
    <section className="welcome-banner admin-welcome"><div className="welcome-orb welcome-orb-one"/><div className="welcome-orb welcome-orb-two"/><div className="welcome-content"><div className="eyebrow light-eyebrow"><Sparkles size={14}/> CAMPUS OPERATIONS CENTER</div><h1>Campus at a glance <span className="wave">✦</span></h1><p>See what needs attention, track resolutions, and turn student feedback into action.</p><div className="welcome-actions"><Link className="button button-white" to="/admin/complaints"><ClipboardList size={17}/> Manage complaints</Link><Link className="button button-glass" to="/admin/analytics">Explore analytics <ArrowUpRight size={16}/></Link></div></div><div className="admin-hero-metric"><div className="hero-metric-icon"><BarChart3 size={23}/></div><span>RESOLUTION RATE</span><strong>{loading?"—":`${resolutionRate}%`}</strong><div className="hero-progress"><i style={{width:`${resolutionRate}%`}}/></div><small>{resolved} of {total} complaints resolved</small></div></section>
    <div className="section-heading"><div><div className="eyebrow">LIVE WORKSPACE</div><h2>Operations overview</h2><p>Key metrics from your complaint management system.</p></div><button className="button button-outline button-sm" onClick={()=>{setLoading(true);setError("");setRefresh(v=>v+1)}}><RefreshCw size={15}/> Refresh data</button></div>
    {error&&<div className="inline-error"><CircleAlert size={18}/><span>{error}</span><button onClick={()=>{setLoading(true);setError("");setRefresh(v=>v+1)}}>Try again</button></div>}
    <div className="stats-grid"><StatCard icon={ClipboardList} label="Total complaints" value={loading?"—":total} tone="purple" note="All-time submissions"/><StatCard icon={CircleAlert} label="Awaiting review" value={loading?"—":open} tone="amber" note="Open and unassigned"/><StatCard icon={Clock3} label="In progress" value={loading?"—":progress} tone="blue" note="Currently being handled"/><StatCard icon={CheckCircle2} label="Resolved" value={loading?"—":resolved} tone="green" note={`${resolutionRate}% overall resolution`}/></div>
    <div className="dashboard-grid admin-charts">
      <section className="panel chart-panel"><div className="panel-heading"><div><h3>Complaints by category</h3><p>Most reported campus issues</p></div><span className="panel-icon"><Activity size={18}/></span></div>{loading?<div className="loading-state">Loading analytics…</div>:categories.length===0?<div className="empty-chart"><div className="empty-icon"><BarChart3 size={24}/></div><strong>Analytics will appear here</strong><p>Category insights appear when complaints have been submitted.</p></div>:<div className="chart-area"><ResponsiveContainer width="100%" height="100%"><BarChart data={categories} margin={{top:10,right:8,left:-20,bottom:0}}><CartesianGrid stroke="#EEF0F6" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill:"#8C91A5",fontSize:11}} interval={0}/><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill:"#8C91A5",fontSize:12}}/><Tooltip contentStyle={{borderRadius:12,border:"1px solid #E9EAF2"}}/><Bar dataKey="count" name="Complaints" fill="#7667E8" radius={[6,6,0,0]} maxBarSize={42}/></BarChart></ResponsiveContainer></div>}</section>
      <section className="panel chart-panel"><div className="panel-heading"><div><h3>Status distribution</h3><p>Current complaint pipeline</p></div><span className="panel-icon panel-icon-green"><Activity size={18}/></span></div>{!loading&&total===0?<div className="empty-chart"><div className="empty-icon"><ClipboardList size={24}/></div><strong>No complaint data yet</strong><p>New submissions will be summarized here.</p></div>:<><div className="donut-wrap"><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={[{name:"Open",value:open},{name:"In progress",value:progress},{name:"Resolved",value:resolved}].filter(x=>x.value>0)} dataKey="value" nameKey="name" innerRadius={55} outerRadius={77} paddingAngle={4} stroke="none">{[open,progress,resolved].filter(v=>v>0).map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{loading?"—":total}</strong><span>Total reports</span></div></div><div className="legend-list">{[{name:"Open",value:open,color:COLORS[1]},{name:"In progress",value:progress,color:COLORS[0]},{name:"Resolved",value:resolved,color:COLORS[2]}].map(x=><div className="legend-row" key={x.name}><span className="legend-name"><i style={{background:x.color}}/>{x.name}</span><strong>{loading?"—":x.value}</strong></div>)}</div></>}</section>
    </div>
    <div className="dashboard-grid admin-lower">
      <section className="panel recent-panel"><div className="panel-heading"><div><h3>Latest submissions</h3><p>Most recently reported issues</p></div><Link className="text-link" to="/admin/complaints">View all <ChevronRight size={16}/></Link></div>{loading?<div className="loading-state">Loading complaints…</div>:latest.length===0?<div className="empty-table"><div className="empty-icon"><ClipboardList size={25}/></div><strong>All quiet for now</strong><p>New campus reports will appear here.</p></div>:<div className="table-scroll"><table className="modern-table"><thead><tr><th>Complaint</th><th>Submitted</th><th>Status</th><th></th></tr></thead><tbody>{latest.map(c=><tr key={c.id}><td><div className="complaint-cell"><span className="complaint-mini-icon"><ClipboardList size={16}/></span><div><strong>{c.title}</strong><small>{c.category||"General"} · #{String(c.public_ticket_id||c.id).slice(0,8)}</small></div></div></td><td><span className="muted-cell"><CalendarDays size={14}/>{c.created_at?new Date(c.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"—"}</span></td><td><span className={`status-pill status-${String(c.status||"OPEN").toLowerCase()}`}><i/>{({OPEN:"Open",IN_PROGRESS:"In progress",RESOLVED:"Resolved"})[c.status]||c.status}</span></td><td><Link className="table-action" to="/admin/complaints">Review <ChevronRight size={14}/></Link></td></tr>)}</tbody></table></div>}</section>
      <section className="panel priority-panel"><div className="panel-heading"><div><h3>Needs attention</h3><p>Highest priority unresolved reports</p></div><span className="priority-count">{urgent.length}</span></div>{loading?<div className="loading-state">Loading priorities…</div>:urgent.length===0?<div className="empty-chart"><CheckCircle2 size={25}/><strong>Nothing urgent right now</strong><p>All caught up. Nice work!</p></div>:<div className="priority-list">{urgent.map(c=><div className="priority-item" key={c.id}><span className="priority-dot"/><div className="priority-copy"><strong>{c.title}</strong><span>{c.category||"General"} · Priority {Number(c.priority_score||0).toFixed(1)}</span></div><Link to="/admin/complaints" aria-label={`Review ${c.title}`}><ChevronRight size={17}/></Link></div>)}</div>}<Link className="button button-outline full-button" to="/admin/complaints">Review complaint queue <ArrowUpRight size={15}/></Link></section>
    </div>
    <div className="bottom-note"><div className="note-icon"><Sparkles size={18}/></div><div><strong>Make decisions with context.</strong><p>Use analytics to spot recurring issues and focus your team where it matters.</p></div><Link to="/admin/analytics" className="note-action">Open analytics <ArrowUpRight size={15}/></Link></div>
  </div>;
}
