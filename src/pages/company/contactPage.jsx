import React, { useState } from "react";
import apiClient from "../../api/axios";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // 1. Prevent the default browser refresh immediately
    e.preventDefault();

    setStatus({ loading: true, success: null, error: null });

    try {
      // 2. Make the API call
      await apiClient.post("/api/contact", formData);

      // 3. Handle success
      setStatus({
        loading: false,
        success: "Message sent! We will contact you shortly.",
        error: null,
      });
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: null }));
      }, 5000);
    } catch (err) {
      console.error("Contact Error:", err);
      // 4. Handle error
      setStatus({
        loading: false,
        success: null,
        error:
          err.response?.data?.message ||
          "Failed to send message. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">
        Get in Touch
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-6">
              Have questions about our courses? Fill out the form or reach us
              directly.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <Mail className="w-5 h-5 text-blue-600 mr-3" />
              <span>support@knowledgeadda.com</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="w-5 h-5 text-blue-600 mr-3" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 text-blue-600 mr-3" />
              <span>Gurugram, India</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
        >
          {status.success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
              {status.success}
            </div>
          )}
          {status.error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {status.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Inquiry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              disabled={status.loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center disabled:bg-blue-400"
            >
              {status.loading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
