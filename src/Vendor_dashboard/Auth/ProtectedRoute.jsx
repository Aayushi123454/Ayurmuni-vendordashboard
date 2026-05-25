import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  children,
  requiredRoles = [],
  redirectTo = "/login",
}) => {
  const location = useLocation();
  const token = sessionStorage.getItem("accessToken");
  const userRole = sessionStorage.getItem("role");
  const onboarding = JSON.parse(sessionStorage.getItem("profile"))


  // Onboarding incomplete

  if (onboarding?.email == null) {
    return <Navigate to={userRole === "doctor"
      ? "/doctor/onboarding"
      : "/vendor/onboarding"} replace />;
  }

  // Check authentication
  const isAuthenticated =
    token &&
    token !== "undefined" &&
    token !== "null" &&
    token.trim() !== "";

  // Validate JWT token
  const isTokenValid = () => {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  // Not logged in
  if (!isAuthenticated) {
    sessionStorage.setItem(
      "redirectAfterLogin",
      location.pathname + location.search
    );

    return <Navigate to={redirectTo} replace />;
  }

  // Token expired
  if (!isTokenValid()) {
    sessionStorage.clear();

    sessionStorage.setItem(
      "redirectAfterLogin",
      location.pathname + location.search
    );

    return <Navigate to={redirectTo} replace />;
  }

  // Role check
  if (
    requiredRoles.length > 0 &&
    (!userRole || !requiredRoles.includes(userRole))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }



  /* -------------------------------- */
  /* Vendor Verification Check */
  /* -------------------------------- */


  const isVerified = onboarding?.verify;

  // Allowed routes before verification
  const allowedUnverifiedRoutes = [
    "/" + userRole + "/profile",
    "/" + userRole + "/help-support",
    "/" + userRole + "/settings",
  ];

  if (
    !isVerified &&
    !allowedUnverifiedRoutes.includes(
      location.pathname
    )
  ) {
    return (
      <Navigate
        to={"/" + userRole + "/profile"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;