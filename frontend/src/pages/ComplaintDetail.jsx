import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api";
import { useToast } from "../context/ToastContext";

const ComplaintDetail = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [complaint, setComplaint] = useState(null);
  const [duplicates, setDuplicates] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, dupRes, histRes] = await Promise.all([
          axios.get(`/complaints/${id}`),
          axios.get(`/complaints/${id}/duplicates`),
          axios.get(`/complaints/${id}/history`),
        ]);
        setComplaint(cRes.data);
        setDuplicates(dupRes.data);
        setHistory(histRes.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load complaint");
        showToast("error", err.response?.data?.detail || "Failed to load complaint");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!complaint) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Complaint Detail</h1>
      <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
        <p><strong>Title:</strong> {complaint.title}</p>
        <p><strong>Description:</strong> {complaint.description}</p>
        <p><strong>Status:</strong> {complaint.status}</p>
        <p><strong>Category:</strong> {complaint.category}</p>
        <p><strong>Severity:</strong> {complaint.severity}</p>
        <p><strong>Urgency:</strong> {complaint.urgency}</p>
        <p><strong>Suggested Dept:</strong> {complaint.suggested_department}</p>
        <p><strong>AI Summary:</strong> {complaint.ai_summary}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Possible Duplicates</h2>
        {duplicates.length === 0 ? (
          <p>No duplicates found.</p>
        ) : (
          <ul className="list-disc pl-5">
            {duplicates.map((d) => (
              <li key={d.id}>
                Ticket {d.public_ticket_id} – similarity: {d.similarity?.toFixed(2) || "-"}
                {' '}<Link to={`/complaint/${d.id}`} className="text-indigo-600 hover:underline">View</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold">History</h2>
        {history.length === 0 ? (
          <p>No history records.</p>
        ) : (
          <ul className="list-disc pl-5">
            {history.map((h) => (
              <li key={h.id}>
                [{new Date(h.timestamp).toLocaleString()}] {h.action} by user #{h.performed_by}{h.note ? ` – ${h.note}` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetail;
