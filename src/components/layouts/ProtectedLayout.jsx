import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const dashboard = useSelector((store) => store.dashboard.dashboard);

  if (dashboard?.remaining_credit <= 0) {
    return <Navigate to="/credit" replace />;
  }

  return children; 
};

export default ProtectedRoute;
