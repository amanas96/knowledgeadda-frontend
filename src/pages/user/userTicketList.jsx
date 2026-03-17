import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { Link } from "react-router-dom";
import { Ticket, Clock } from "lucide-react";

const UserTicketList = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    apiClient.get("/api/contact/my").then((res) => {
      setTickets(res.data.tickets);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Support Tickets</h1>

      <Link
        to="/support/new"
        className="mb-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Create New Ticket
      </Link>

      <div className="space-y-4">
        {tickets.map((t) => (
          <Link
            key={t._id}
            to={`/support/ticket/${t._id}`}
            className="block bg-white p-5 border rounded-lg shadow hover:shadow-md"
          >
            <h3 className="text-lg font-bold">{t.subject}</h3>

            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full inline-block mt-1">
              {t.status.toUpperCase()}
            </span>

            <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
              <Clock size={12} />
              {new Date(t.updatedAt).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserTicketList;
