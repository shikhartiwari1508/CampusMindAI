import React, { useEffect, useState } from "react";
import axios from "../api";
import { useToast } from "../context/ToastContext";
import { Link } from "react-router-dom";
import { Search, RefreshCw, Pencil, X, Save, ClipboardList, CheckCircle2, Clock3, CircleDot } from "lucide-react";

const STATUSES = [
  { value: "OPEN", label: "Open", description: "New complaint; work not started", icon: CircleDot, color: "bg-amber-50 text-amber-700 ring-amber-200" },
  { value: "IN_PROGRESS", label: "In progress", description: "Department is working on it", icon: Clock3, color: "bg-blue-50 text-blue-700 ring-blue-200" },
  { value: "RESOLVED", label: "Resolved", description: "Problem has been fixed", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
];
const statusMeta = (status) => STATUSES.find((s) => s.value === status) || STATUSES[0];

const AdminComplaints = () => {
  const { showToast } = useToast();
  const [filters, setFilters] = useState({ status: "", category: "", building: "" });
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({ status: "OPEN", category: "", assigned_department: "", resolution_note: "", note: "" });

  const fetchComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status_filter", filters.status);
      if (filters.category.trim()) params.append("category", filters.category.trim());
      if (filters.building.trim()) params.append("building", filters.building.trim());
      const query = params.toString();
      const res = await axios.get(`/admin/complaints${query ? `?${query}` : ""}`);
      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const message = err.response?.data?.detail || "Could not load complaints. Check admin login and backend.";
      setError(typeof message === "string" ? message : "Could not load complaints.");
      showToast("error", typeof message === "string" ? message : "Could not load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [filters.status, filters.category, filters.building]);

  const openEdit = (c) => {
    setEditId(c.id);
    setEditData({ status: c.status || "OPEN", category: c.category || "", assigned_department: c.assigned_department || c.suggested_department || "", resolution_note: c.resolution_note || "", note: "" });
  };
  const closeEdit = () => {
    setEditId(null);
    setEditData({ status: "OPEN", category: "", assigned_department: "", resolution_note: "", note: "" });
  };
  const handleEditChange = (e) => setEditData((old) => ({ ...old, [e.target.name]: e.target.value }));

  const submitEdit = async () => {
    if (editData.status === "RESOLVED" && !editData.resolution_note.trim()) {
      showToast("error", "Please add a short resolution note before marking this resolved.");
      return;
    }
    setSaving(true);
    try {
      await axios.patch(`/admin/${editId}`, {
        status: editData.status,
        category: editData.category || null,
        assigned_department: editData.assigned_department || null,
        resolution_note: editData.status === "RESOLVED" ? editData.resolution_note.trim() : (editData.resolution_note.trim() || null),
      });
      if (editData.note.trim()) await axios.post(`/admin/${editId}/notes`, { note: editData.note.trim() });
      showToast("success", "Complaint status and details saved.");
      closeEdit();
      await fetchComplaints();
    } catch (err) {
      const detail = err.response?.data?.detail;
      showToast("error", typeof detail === "string" ? detail : "Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const visibleComplaints = complaints.filter((c) => {
    const text = `${c.public_ticket_id || ""} ${c.title || ""} ${c.category || ""} ${c.building || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });
  const countFor = (status) => complaints.filter((c) => c.status === status).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">CampusMind AI · Administration</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Complaint management</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Review incoming issues, assign departments and keep students informed.</p>
        </div>
        <button onClick={fetchComplaints} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
          <RefreshCw size={16} /> Refresh list
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATUSES.map((s) => { const Icon = s.icon; return <div key={s.value} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"><div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</span><span className={`rounded-xl p-2 ${s.color}`}><Icon size={18} /></span></div><p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{loading ? "—" : countFor(s.value)}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.description}</p></div>; })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-700 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950"><ClipboardList size={20} /></span><div><h2 className="font-bold text-slate-900 dark:text-white">All complaints</h2><p className="text-sm text-slate-500 dark:text-slate-400">Choose Edit to change status and add an update.</p></div></div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input aria-label="Search complaints" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ticket or title" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-900" /></div>
            <select aria-label="Filter status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-900"><option value="">All statuses</option>{STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
            <input aria-label="Filter category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} placeholder="Category filter" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-900" />
            <input aria-label="Filter building" value={filters.building} onChange={(e) => setFilters({ ...filters, building: e.target.value })} placeholder="Building filter" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-900" />
          </div>
        </div>

        {error && <div className="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
        {loading ? <div className="space-y-3 p-6"><div className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700" /><div className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700" /><div className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700" /></div> : visibleComplaints.length === 0 ? <div className="p-12 text-center"><ClipboardList className="mx-auto text-slate-300" size={36} /><p className="mt-3 font-semibold text-slate-700 dark:text-slate-200">No complaints found</p><p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p></div> : <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900/70"><tr><th className="px-5 py-4 font-semibold">Ticket / Issue</th><th className="px-5 py-4 font-semibold">Category</th><th className="px-5 py-4 font-semibold">Location</th><th className="px-5 py-4 font-semibold">Status</th><th className="px-5 py-4 font-semibold">Submitted</th><th className="px-5 py-4 text-right font-semibold">Action</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-700">{visibleComplaints.map((c) => { const s = statusMeta(c.status); return <tr key={c.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-700/30"><td className="px-5 py-4"><Link to={`/complaint/${c.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 dark:text-white">{c.title}</Link><p className="mt-1 font-mono text-xs text-slate-400">#{(c.public_ticket_id || String(c.id)).slice(0, 8)}</p></td><td className="px-5 py-4 text-slate-600 dark:text-slate-300">{c.category || "Uncategorised"}</td><td className="px-5 py-4 text-slate-600 dark:text-slate-300">{[c.building, c.location_details].filter(Boolean).join(" · ") || "—"}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${s.color}`}><s.icon size={13} />{s.label}</span></td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</td><td className="px-5 py-4 text-right"><button onClick={() => openEdit(c)} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"><Pencil size={14} /> Manage</button></td></tr>; })}</tbody></table></div>}
      </section>

      {editId && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) closeEdit(); }}><div role="dialog" aria-modal="true" aria-labelledby="edit-complaint-title" className="my-8 w-full max-w-xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900"><div className="flex items-start justify-between border-b border-slate-100 p-6 dark:border-slate-700"><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Ticket #{String(editId).padStart(4, "0")}</p><h2 id="edit-complaint-title" className="mt-1 text-xl font-bold text-slate-900 dark:text-white">Update complaint</h2><p className="mt-1 text-sm text-slate-500">Change its progress and leave a clear record for the student.</p></div><button onClick={closeEdit} disabled={saving} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"><X size={19} /></button></div><div className="space-y-5 p-6"><div><label htmlFor="status" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Complaint status</label><select id="status" name="status" value={editData.status} onChange={handleEditChange} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-800">{STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label} — {s.description}</option>)}</select><p className="mt-2 text-xs text-slate-500">Select Open when received, In progress when work starts, and Resolved after the issue is fixed.</p></div><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Category</label><input id="category" name="category" value={editData.category} onChange={handleEditChange} placeholder="e.g. Electricity" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-800" /></div><div><label htmlFor="assigned_department" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Assigned department</label><input id="assigned_department" name="assigned_department" value={editData.assigned_department} onChange={handleEditChange} placeholder="e.g. Electrical Maintenance" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-800" /></div></div><div><label htmlFor="resolution_note" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Resolution details {editData.status === "RESOLVED" && <span className="text-rose-600">*</span>}</label><textarea id="resolution_note" name="resolution_note" value={editData.resolution_note} onChange={handleEditChange} rows={2} placeholder="What was fixed? Required when marking resolved." className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-800" /></div><div><label htmlFor="note" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Internal admin note (optional)</label><textarea id="note" name="note" value={editData.note} onChange={handleEditChange} rows={2} placeholder="Add an update or handover note" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-800" /></div></div><div className="flex flex-col-reverse gap-2 rounded-b-2xl border-t border-slate-100 bg-slate-50 p-5 sm:flex-row sm:justify-end dark:border-slate-700 dark:bg-slate-800/60"><button onClick={closeEdit} disabled={saving} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-white disabled:opacity-50 dark:border-slate-600 dark:text-slate-200">Cancel</button><button onClick={submitEdit} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"><Save size={16} />{saving ? "Saving…" : "Save changes"}</button></div></div></div>}
    </div>
  );
};

export default AdminComplaints;
