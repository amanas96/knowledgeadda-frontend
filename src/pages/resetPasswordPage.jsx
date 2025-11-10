import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { useParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { resetPassword } = useAuth();

  // Get the token from the URL (e.g., /reset-password/:token)
  const { token } = useParams();
  console.log("🔍 ResetPasswordPage rendered");
  console.log("🔑 Token from URL:", token);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const success = await resetPassword(token, password);

    if (success) {
      setMessage("Password reset successfully! Redirecting to login...");
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      setError("Invalid or expired token. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Reset Your Password</h2>

      {message ? (
        <p className="text-green-600 bg-green-100 p-3 rounded">{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Set New Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
