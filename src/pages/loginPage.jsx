import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/authLayout";
import AuthInput from "../components/authInput";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const success = await login(email, password);

      if (success) {
        navigate("/"); // Redirect to homepage on successful login
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Login to access your courses and profile"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-md p-3 text-sm text-center">
            {error}
          </div>
        )}

        <AuthInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <AuthInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
        >
          Login
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Forgot your password?{" "}
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline font-medium"
            >
              Reset here
            </Link>
          </p>
          <p className="mt-2">
            New to KnowledgeAdda?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
