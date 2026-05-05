
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("superadmin_token");



  return children;
};

export default ProtectedRoute;