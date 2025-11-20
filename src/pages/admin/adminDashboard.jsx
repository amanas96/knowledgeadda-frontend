import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    // We can add 'totalUsers' later if we build that API endpoint
  });

  useEffect(() => {
    // Fetch basic stats
    const fetchStats = async () => {
      try {
        const { data } = await apiClient.get("/api/v1/courses");
        setStats({ totalCourses: data.length });
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Dashboard Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
            Total Courses
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats.totalCourses}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">$0.00</p>{" "}
          {/* Placeholder */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
            Active Users
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">-</p>{" "}
          {/* Placeholder */}
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/courses/new"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Create New Course
              </h3>
              <p className="text-sm text-gray-500">
                Add a new video series or tutorial.
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/courses"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600 mr-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Manage Content
              </h3>
              <p className="text-sm text-gray-500">
                Edit existing courses and quizzes.
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/quizzes/new"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
        >
          + Create New Quiz
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
