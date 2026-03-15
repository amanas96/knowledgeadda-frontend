import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { useParams } from "react-router-dom";

const UserTicketConversation = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    apiClient.get("/api/contact/my").then((res) => {
      const found = res.data.tickets.find((t) => t._id === id);
      setTicket(found);
    });
  }, [id]);

  const sendReply = async () => {
    if (!reply.trim()) return;

    const { data } = await apiClient.post(`/api/contact/reply/user/${id}`, {
      text: reply,
    });

    setTicket(data.ticket);
    setReply("");
  };

  if (!ticket) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold">{ticket.subject}</h1>

      <div className="bg-gray-50 p-4 rounded-lg mt-4 space-y-4 border">
        {ticket.messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-lg ${
              m.senderType === "admin"
                ? "bg-blue-100 mr-auto"
                : "bg-green-100 ml-auto"
            }`}
          >
            {m.text}
            <div className="text-xs text-gray-500 mt-1">
              {new Date(m.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {ticket.status !== "closed" && (
        <div className="mt-5">
          <textarea
            className="w-full border rounded-lg p-3"
            rows="3"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write your reply..."
          />

          <button
            onClick={sendReply}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg mt-3"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTicketConversation;
