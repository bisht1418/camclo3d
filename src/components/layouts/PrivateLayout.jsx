import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateLayout = ({ children }) => {
  let location = useLocation();

  const { is_authenticated } = useSelector((state) => state.global);

  if (is_authenticated) {
    return children
  }

  return children;
};

export default PrivateLayout;
