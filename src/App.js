import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";

// Shared Components
import Sidebar from "./Vendor_dashboard/Sidebar/sidebar";
import Header from "./Vendor_dashboard/Header/Header";
import ProtectedRoute from "./Vendor_dashboard/Auth/ProtectedRoute";
import DoctorSidebar from "./Doctor_dashboard/Sidebar/sidebar";
import DoctorAvailabilityCalendar2 from "./Doctor_dashboard/components/availability/DoctorAvailabilityCalendar/index";
import DoctorVideoCall from "./Doctor_dashboard/components/videocall/DoctorVideoCall";
import PatientVideoCallWeb from "./Doctor_dashboard/components/videocall/PatientVideoCallWeb";
import InventoryVault from "./Vendor_dashboard/Pages/Inventory/Inventory";
import AddProduct from "./Vendor_dashboard/Pages/Inventory/AddProduct";
import EditProduct from "./Vendor_dashboard/Pages/Inventory/editproduct";
import Messenger from "./Doctor_dashboard/components/messenger/messanger";

// Doctor Pages
const DoctorDashboard = lazy(() => import("./Doctor_dashboard/components/dashboard/Dashboard"));
const DoctorOnboarding = lazy(() => import("./Doctor_dashboard/components/onboarding/Onboarding"));
const AppointmentsPage = lazy(() => import("./Doctor_dashboard/components/Appointment/Appointment"));
const PatientManagement = lazy(() => import("./Doctor_dashboard/components/Patients/Patients"));
// const PatientDetailPage = lazy(() => import("./Doctor_dashboard/components/Patients/PatientDetailPage"));
const FinanceDashboard = lazy(() => import("./Doctor_dashboard/components/Finance/FinanceManagement"));
const DoctorReviewInsights = lazy(() => import("./Doctor_dashboard/components/Reviews/DoctorReviewInsights"));
const HelpSupport = lazy(() => import("./Doctor_dashboard/components/HelpSupport/HelpSupport"));
const DoctorProfile = lazy(() => import("./Doctor_dashboard/components/Profile/Profile"));
const AppointmentDetail = lazy(() => import("./Doctor_dashboard/components/Appointment/AppointmentDetails"));

// Lazy Loaded Vendor Pages
const Login = lazy(() => import("./Vendor_dashboard/Auth/Login"));
const Dashboard = lazy(() => import("./Vendor_dashboard/Pages/Dashboard/Dashboard"));
const Order = lazy(() => import("./Vendor_dashboard/Pages/Order/Order"));
const OrderDetail = lazy(() => import("./Vendor_dashboard/Pages/OrderDetail/OrderDetail"));
const Notification = lazy(() => import("./Vendor_dashboard/Pages/Notification/Notification"));
const VendorOnboarding = lazy(() => import("./Vendor_dashboard/Pages/onboarding/Onboarding"));
const VendorProfile = lazy(() => import("./Vendor_dashboard/Pages/Profile/Profile"));

// Loader
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

/** Redirects users who already completed onboarding away from onboarding pages */
function OnboardingRedirect() {
  useEffect(() => {
    try {
      const onboarding = JSON.parse(sessionStorage.getItem("profile") || "null");
      const role = sessionStorage.getItem("role");
      const hasCompletedProfile = Boolean(onboarding?.email?.trim());
      const path = window.location.pathname;

      if (hasCompletedProfile && (path === "/vendor/onboarding" || path === "/doctor/onboarding")) {
        window.location.replace(role === "doctor" ? "/doctor/dashboard" : "/vendor/dashboard");
      }
    } catch {
      // ignore malformed session storage
    }
  }, []);
  return null;
}

function App() {
  const token = sessionStorage.getItem("accessToken");
  const role = sessionStorage.getItem("role");
  const isAuthenticated = !!token;

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <OnboardingRedirect />
        <Routes>
          <Route path="patvideocall/:token/:consultationId" element={<PatientVideoCallWeb />} />
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />

          {/* DOCTOR ROUTES */}
          {isAuthenticated && role === "doctor" && (
            <>
              <Route path="/doctor/onboarding" element={<DoctorOnboarding />} />
              <Route
                path="/doctor"
                element={
                  <ProtectedRoute>
                    <DoctorLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="availability" element={<DoctorAvailabilityCalendar2 />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="appointments/:type/:appointmentId" element={<AppointmentDetail />} />
                <Route path="patients" element={<PatientManagement />} />
                {/* <Route path="patients/detail/:patientId" element={<PatientDetailPage />} /> */}
                <Route path="patients/:type/:appointmentId" element={<AppointmentDetail />} />
                <Route path="videocall/:consultationId" element={<DoctorVideoCall />} />
                <Route path="messages" element={<Messenger />} />
                <Route path="assessments" element={<Navigate to="/doctor/appointments" replace />} />
                <Route path="earnings" element={<FinanceDashboard />} />
                <Route path="reviews" element={<DoctorReviewInsights />} />
                <Route path="help-support" element={<HelpSupport />} />
                <Route path="Help-support" element={<Navigate to="/doctor/help-support" replace />} />
                <Route path="notifications" element={<Notification />} />
                <Route path="profile" element={<DoctorProfile />} />
                <Route path="settings" element={<Navigate to="/doctor/profile" replace />} />
              </Route>
            </>
          )}

          {/* VENDOR ROUTES */}
          {isAuthenticated && role === "vendor" && (
            <>
              <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
              <Route
                path="/vendor"
                element={
                  <ProtectedRoute>
                    <VendorLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<InventoryVault />} />
                <Route path="new-product" element={<AddProduct />} />
                <Route path="edit-product/:id" element={<EditProduct />} />
                <Route path="orders" element={<Order />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="profile" element={<VendorProfile />} />
                <Route path="notifications" element={<Notification />} />
              </Route>
            </>
          )}

          {/* REDIRECTS */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? <Navigate to={role === "vendor" ? "/vendor/dashboard" : "/doctor/dashboard"} replace />
                : <Navigate to="/login" replace />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? ("/" + role + "/dashboard") : "/login"}
                replace
              />
            }
          />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

function DoctorLayout() {
  return (
    <div style={{ display: "flex" }}>
      <DoctorSidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function VendorLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
