import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../../components/authLayout";
import AuthInput from "../../components/authInput";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);

    if (result) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 4000);
    } else {
      alert("❌ Invalid or expired token. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter a new password for your account."
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
            <AuthInput
              id="password"
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
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
              {loading ? "Updating..." : "Set New Password"}
            </button>
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
              Password Reset Successful!
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Your password has been updated successfully. You can now log in
              using your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-block mt-3 text-blue-600 font-medium hover:underline"
            >
              Go to Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
