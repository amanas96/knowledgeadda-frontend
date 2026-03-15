import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import {
  adminGetAllTickets,
  adminReplyToTicket,
  adminCloseTicket,
} from "../../api/adminApi"; // ✅
import apiClient from "../../api/axios";

const AdminTicketConversation = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const adminId = user?._id;
  const [ticket, setTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await adminGetAllTickets(); // ✅
        const found = data.tickets.find((t) => t._id === id);
        setTicket(found);
      } catch (err) {
        console.error("Load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const sendReply = async () => {
    if (!replyText.trim()) return;
    const { data } = await adminReplyToTicket(id, replyText); // ✅
    setTicket(data.ticket);
    setReplyText("");
  };

  const closeTicket = async () => {
    const { data } = await adminCloseTicket(id); // ✅
    setTicket(data.ticket);
  };

  const reopenTicket = async () => {
    const { data } = await apiClient.put(`/api/contact/reopen/${id}`); // user route
    setTicket(data.ticket);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!ticket) return <div>Ticket not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{ticket.subject}</h1>
      <div className="bg-gray-50 p-5 rounded-lg space-y-4 border">
        {ticket.messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-lg ${m.senderType === "admin" ? "bg-blue-100 ml-auto" : "bg-white mr-auto"}`}
          >
            <p className="text-sm">{m.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(m.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      {ticket.status !== "closed" &&
        (!ticket.assignedTo || ticket.assignedTo?._id === adminId) && (
          <div className="mt-6">
            <textarea
              className="w-full p-3 border rounded-lg"
              rows="3"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button
              onClick={sendReply}
              className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Send Reply
            </button>
          </div>
        )}
      <div className="mt-6 flex gap-3">
        {ticket.status === "replied" && (
          <button
            onClick={closeTicket}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            Close Ticket
          </button>
        )}
        {ticket.status === "closed" && (
          <button
            onClick={reopenTicket}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
          >
            Reopen Ticket
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminTicketConversation;
