import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api";
import { useToast } from "../context/ToastContext";

const MyComplaints = () => {
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/complaints/");
        setComplaints(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load complaints");
        showToast("error", err.response?.data?.detail || "Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">My Complaints</h1>
      {complaints.length === 0 ? (
        <p>No complaints submitted yet.</p>
      ) : (
        <table className="min-w-full bg-white dark:bg-gray-800 border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Ticket ID</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Priority</th>
              <th className="px-4 py-2 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id} className="text-center">
                <td className="px-4 py-2 border">{c.public_ticket_id.slice(0, 8)}…</td>
                <td className="px-4 py-2 border">{c.title}</td>
                <td className="px-4 py-2 border">{c.status}</td>
                <td className="px-4 py-2 border">{c.priority_score?.toFixed(2) || "-"}</td>
                <td className="px-4 py-2 border">
                  <Link to={`/complaint/${c.id}`} className="text-indigo-600 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyComplaints;
