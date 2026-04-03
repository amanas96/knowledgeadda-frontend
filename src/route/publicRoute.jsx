import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Children } from "react";

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;
  if (user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

export default PublicRoute;
