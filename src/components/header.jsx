import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link to="/">KnowledgeAdda</Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/courses">Courses</Link>
          </li>

          {isAuthenticated ? (
            // --- Show if Logged In ---
            <>
              <li className="text-yellow-400">Welcome, {user?.name}!</li>
              <li>
                <button onClick={logout} className="hover:text-gray-300">
                  Logout
                </button>
              </li>
            </>
          ) : (
            // --- Show if Logged Out ---
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
