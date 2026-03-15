import React, { useState } from "react";
import { XCircle } from "lucide-react";
import { adminReplyToTicket } from "../../api/adminApi"; // ✅

const ReplyModal = ({ message, closeModal, setMessages }) => {
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const sendReply = async () => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      const { data } = await adminReplyToTicket(message._id, replyText); // ✅
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? data.contact : m)),
      );
      closeModal();
    } catch (err) {
      console.error("Reply failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Reply to: {message.email}</h3>
          <button onClick={closeModal}>
            <XCircle size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <textarea
          rows="5"
          className="w-full p-3 border rounded-lg"
          placeholder="Type your reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            disabled={loading}
            onClick={sendReply}
          >
            {loading ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
