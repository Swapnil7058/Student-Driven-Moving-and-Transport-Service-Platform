import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className=" text-blue-600 text-2xl text-center py-10">
        Loading...
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
