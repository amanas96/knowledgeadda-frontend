import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold tracking-wider">
            <Link to="/admin">Admin Dashboard</Link>
          </div>
          <nav className="flex space-x-6 text-sm font-medium">
            <Link
              to="/admin/courses"
              className="hover:text-blue-400 transition-colors"
            >
              Manage Courses
            </Link>
            <Link
              to="/admin/users"
              className="hover:text-blue-400 transition-colors"
            >
              Users
            </Link>
            <Link to="/" className="hover:text-blue-400 transition-colors">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-grow container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
