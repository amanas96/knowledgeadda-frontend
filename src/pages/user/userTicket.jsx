import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";

const CreateTicket = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.subject || !form.message) {
      setError("Subject and message are required");
      return;
    }

    try {
      setLoading(true);

      // ⚠️ CHANGE ENDPOINT IF NEEDED
      const { data } = await apiClient.post("/api/contact", {
        subject: form.subject,
        message: form.message,
      });

      /**
       * Expected response shape:
       * {
       *   ticket: { _id: "..." }
       * }
       */
      const ticketId = data?.ticket?._id || data?.contact?._id;

      if (!ticketId) {
        throw new Error("Ticket ID not returned");
      }

      navigate(`/support/ticket/${ticketId}`);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to create ticket. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Create Support Ticket</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow-sm p-6 space-y-5"
      >
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="e.g. Payment issue"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            placeholder="Describe your issue in detail..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/support")}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
