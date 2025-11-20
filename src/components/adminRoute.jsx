// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// const AdminRoute = () => {
//   const { user, isLoading } = useAuth();

//   // 1. Wait for auth check to finish
//   if (isLoading) {
//     return <div className="text-center mt-20">Checking permissions...</div>;
//   }

//   // 2. Check if user exists AND is an admin
//   if (user && user.isAdmin) {
//     // If yes, render the child routes (The Admin Dashboard)
//     return <Outlet />;
//   } else {
//     // If no, redirect them to the homepage
//     return <Navigate to="/" replace />;
//   }
// };

// export default AdminRoute;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // 1. Wait for auth context to finish checking token
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking permissions...
      </div>
    );
  }

  // 2. Not logged in → redirect to Login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Logged in but NOT admin → redirect home
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 4. User is logged in AND admin → allow access
  return <Outlet />;
};

export default AdminRoute;
