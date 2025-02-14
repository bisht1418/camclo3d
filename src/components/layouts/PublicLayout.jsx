import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PublicLayout = ({ children }) => {
  let location = useLocation();

  const { is_authenticated } = useSelector((state) => state.global);

  if (!is_authenticated) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};

export default PublicLayout;
