import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Clock, User, MessageCircle } from "lucide-react";
import { adminGetAllTickets } from "../../api/adminApi"; // ✅

const AdminTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await adminGetAllTickets(); // ✅
        setTickets(data.tickets);
      } catch (error) {
        console.error("Failed to load tickets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const statusColor = {
    open: "bg-yellow-100 text-yellow-700",
    replied: "bg-green-100 text-green-700",
    closed: "bg-gray-200 text-gray-700",
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Mail className="text-blue-600" /> All Support Tickets
      </h1>
      <div className="space-y-4">
        {tickets.map((t) => (
          <Link
            to={`/admin/tickets/${t._id}`}
            key={t._id}
            className="block bg-white p-6 shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">{t.subject}</h3>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <User size={14} /> {t.name || t.user?.name}
                  <span className="text-gray-400">({t.email})</span>
                </p>
                <span
                  className={`text-xs px-3 py-1 rounded-full inline-block mt-2 ${statusColor[t.status]}`}
                >
                  {t.status.toUpperCase()}
                </span>
                {t.assignedTo ? (
                  <p className="text-sm text-blue-600 mt-1">
                    Assigned: {t.assignedTo.name}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">Unassigned</p>
                )}
              </div>
              <div className="text-xs text-gray-500 flex flex-col items-end">
                <Clock size={12} />
                {new Date(t.updatedAt).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-600 mt-3">
              <MessageCircle size={16} /> View Conversation
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminTicketList;
