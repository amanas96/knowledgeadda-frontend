import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { Mail, Clock, User, XCircle, Reply } from "lucide-react";
import { useAuth } from "../../context/authContext.jsx";
import ReplyModal from "./adminReplyModal.jsx";

const AdminContactList = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { user } = useAuth(); // logged in admin
  const adminId = user?._id;

  // Fetch all messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await apiClient.get("/api/contact");
        setMessages(data.contacts);
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const openReplyModal = (msg) => {
    setSelectedMessage(msg);
    setModalOpen(true);
  };

  const closeReplyModal = () => {
    setSelectedMessage(null);
    setModalOpen(false);
  };

  // Close ticket (status = closed)
  const closeTicket = async (id) => {
    try {
      await apiClient.put(`/api/contact/status/${id}`, {
        status: "closed",
      });

      setMessages((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, status: "closed", closedAt: new Date() } : m
        )
      );
    } catch (err) {
      console.error("Close ticket failed:", err);
    }
  };

  // Reopen ticket (status = open)
  const reopenTicket = async (id) => {
    try {
      await apiClient.put(`/api/contact/status/${id}`, {
        status: "open",
      });

      setMessages((prev) =>
        prev.map((m) =>
          m._id === id
            ? { ...m, status: "open", assignedTo: null, repliedAt: null }
            : m
        )
      );
    } catch (err) {
      console.error("Reopen failed:", err);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading messages...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <Mail className="text-blue-600" /> User Messages
      </h1>

      {/* Reply Modal */}
      {modalOpen && (
        <ReplyModal
          message={selectedMessage}
          closeModal={closeReplyModal}
          setMessages={setMessages}
        />
      )}

      {/* Message List */}
      <div className="grid gap-6">
        {messages.map((msg) => {
          const isAssignedToSomeoneElse =
            msg.assignedTo && msg.assignedTo._id !== adminId;

          return (
            <div
              key={msg._id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {msg.subject}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <User size={14} /> {msg.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={14} /> {msg.email}
                    </span>
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      {msg.assignedTo
                        ? `Assigned: ${msg.assignedTo.name}`
                        : "Unassigned"}
                    </span>
                  </div>

                  {/* Status Badges */}
                  <div className="mt-2">
                    {msg.status === "open" && (
                      <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                        Open
                      </span>
                    )}
                    {msg.status === "replied" && (
                      <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        Replied
                      </span>
                    )}
                    {msg.status === "closed" && (
                      <span className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                        Closed
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>

              <p className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm leading-relaxed border border-gray-100 whitespace-pre-wrap">
                {msg.message}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-4 justify-end">
                {/* If assigned to another admin → disable reply */}
                {isAssignedToSomeoneElse ? (
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed"
                  >
                    Assigned to: {msg.assignedTo.name}
                  </button>
                ) : msg.status === "open" || msg.status === "replied" ? (
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                    onClick={() => openReplyModal(msg)}
                  >
                    <Reply size={16} /> Reply
                  </button>
                ) : null}

                {/* Close or Reopen Buttons */}
                {msg.status === "replied" &&
                  msg.assignedTo?._id === adminId && (
                    <button
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                      onClick={() => closeTicket(msg._id)}
                    >
                      Close Ticket
                    </button>
                  )}

                {msg.status === "closed" && (
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                    onClick={() => reopenTicket(msg._id)}
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminContactList;
