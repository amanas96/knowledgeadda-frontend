import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // 1. Import useAuth

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth(); // 2. Get auth state
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">KnowledgeAdda</Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link to="/courses" className="text-gray-600 hover:text-blue-600">
            Courses
          </Link>
          {/* You can add more links here: "Quizzes", "Pricing", etc. */}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            // --- Show if Logged In ---
            <>
              <span className="text-gray-700">Welcome, {user?.name}!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            // --- Show if Logged Out ---
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
