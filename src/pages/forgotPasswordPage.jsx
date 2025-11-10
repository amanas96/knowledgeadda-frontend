import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";

const forgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const success = await forgotPassword(email);

    if (success) {
      setMessage("Password reset link sent to your email.");
    } else {
      setMessage("failed to send password-reset link. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Forgot Password</h2>

      {message ? (
        <p className="text-green-600 bg-green-100 p-3 rounded">{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="mb-4">
            Enter your email address and we will send you a link to reset your
            password.
          </p>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Send Reset Link
          </button>
        </form>
      )}

      <p className="mt-4">
        Remember your password?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default forgotPasswordPage;
