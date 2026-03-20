import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { Link } from "react-router-dom";
import { Ticket, Clock, Plus, MessageSquare, ChevronRight } from "lucide-react";

const STATUS_STYLE = {
  open: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-500",
  "in-progress": "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
};

const UserTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/api/contact/my")
      .then((res) => setTickets(res.data.tickets || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          to="/support/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600
            hover:bg-blue-700 text-white rounded-xl font-semibold text-sm
            transition shadow-sm"
        >
          <Plus size={16} /> New Ticket
        </Link>
      </div>

      {/* Empty state */}
      {tickets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div
            className="w-14 h-14 bg-blue-50 rounded-full flex items-center
            justify-center mx-auto mb-4"
          >
            <MessageSquare size={24} className="text-blue-400" />
          </div>
          <h3 className="font-bold text-gray-700 mb-1">No tickets yet</h3>
          <p className="text-sm text-gray-400 mb-5">
            Create a ticket if you need help with anything
          </p>
          <Link
            to="/support/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600
              text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition"
          >
            <Plus size={15} /> Create Ticket
          </Link>
        </div>
      ) : (
        // Ticket list
        <div className="space-y-3">
          {tickets.map((t) => (
            <Link
              key={t._id}
              to={`/support/ticket/${t._id}`}
              className="flex items-center gap-4 bg-white px-5 py-4 border
                border-gray-200 rounded-2xl shadow-sm hover:shadow-md
                hover:border-blue-200 transition-all group"
            >
              {/* Icon */}
              <div
                className="w-10 h-10 bg-blue-50 rounded-xl flex items-center
                justify-center flex-shrink-0 group-hover:bg-blue-100 transition"
              >
                <Ticket size={18} className="text-blue-500" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {t.subject}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full
                    ${STATUS_STYLE[t.status] || "bg-gray-100 text-gray-500"}`}
                  >
                    {t.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(t.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight
                size={16}
                className="text-gray-300 group-hover:text-blue-500
                flex-shrink-0 transition-colors"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTicketList;
