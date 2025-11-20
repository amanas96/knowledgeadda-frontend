import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../../components/authLayout";
import AuthInput from "../../components/authInput";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 15000);
    } else {
      alert("❌ Failed to send password reset link. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries — we’ll help you reset it."
    >
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-600 text-sm">
              Enter your registered email address, and we’ll send you a password
              reset link.
            </p>

            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-lg shadow-md transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-indigo-700"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="mt-5 text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login here
              </Link>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            className="flex flex-col items-center justify-center bg-green-50 border border-green-200 rounded-xl p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Reset Link Sent!
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              If an account with this email exists, you’ll receive a password
              reset link shortly.
            </p>
            <Link
              to="/login"
              className="inline-block mt-3 text-blue-600 font-medium hover:underline"
            >
              Back to Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
