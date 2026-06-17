import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";

// Shared Components
import Sidebar from "./Vendor_dashboard/Sidebar/sidebar";
import Header from "./Vendor_dashboard/Header/Header";
import ProtectedRoute from "./Vendor_dashboard/Auth/ProtectedRoute";
import DoctorSidebar from "./Doctor_dashboard/Sidebar/sidebar";
import DoctorAvailabilityCalendar2 from "./Doctor_dashboard/components/availability/DoctorAvailabilityCalendar/index";
import DoctorDashboardTasks from "./Vendor_dashboard/Header/DoctorDashboardTasks";
import ProductManagement from "./Vendor_dashboard/Pages/productManagement/productManagement";
import InventoryVault from "./Vendor_dashboard/Pages/Inventory/Inventory";
import AddProduct from "./Vendor_dashboard/Pages/Inventory/AddProduct";
import EditProduct from "./Vendor_dashboard/Pages/Inventory/editproduct";
import DoctorVideoCall from "./Doctor_dashboard/components/videocall/DoctorVideoCall";
import PatientVideoCallWeb from "./Doctor_dashboard/components/videocall/PatientVideoCallWeb";
// import DoctorAvailabilityCalendar from "./Doctor_dashboard/components/availability/DoctorAvailabilityCalendar";

// Doctor Pages
const DoctorDashboard = lazy(() => import("./Doctor_dashboard/components/dashboard/Dashboard"));
const DoctorOnboarding = lazy(() => import("./Doctor_dashboard/components/onboarding/Onboarding"));
const AppointmentsPage = lazy(() => import("./Doctor_dashboard/components/Appointment/Appointment"));
const PatientManagement = lazy(() => import("./Doctor_dashboard/components/Patients/Patients"));
const FinanceDashboard = lazy(() => import("./Doctor_dashboard/components/Finance/FinanceManagement"));
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

function App() {
  const token = sessionStorage.getItem("accessToken");
  const role = sessionStorage.getItem("role");
  const isAuthenticated = !!token;
  const onboarding = JSON.parse(sessionStorage.getItem("profile"))


  const hasCompletedProfile =
    onboarding?.email &&
    onboarding?.email.trim() !== "";
  console.log(hasCompletedProfile, onboarding, window.location.pathname == "/vendor/onboarding");

  if (hasCompletedProfile && (window.location.pathname == "/vendor/onboarding" || window.location.pathname == "/doctor/onboarding")) {
    const redirectPath = hasCompletedProfile
      ? role === "doctor"
        ? "/doctor/dashboard"
        : "/vendor/dashboard"
      : role === "doctor"
        ? "/doctor/onboarding"
        : "/vendor/onboarding";
    window.location.replace(redirectPath)
  }
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>

          {/* 🔓 PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/DoctorDashboardTasks" element={<DoctorDashboardTasks />} /> */}

          {/* 🧑‍⚕️ DOCTOR ROUTES */}
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
                <Route path="patients/:type/:appointmentId" element={<AppointmentDetail />} />
                <Route path="videocall/:consultationId" element={<DoctorVideoCall />} />
                <Route path="patvideocall" element={<PatientVideoCallWeb />} />
                <Route path="patients" element={<PatientManagement />} />
                <Route path="messages" element={<Order />} />
                <Route path="assessments" element={<Order />} />
                <Route path="earnings" element={<FinanceDashboard />} />
                <Route path="Help-support" element={<HelpSupport />} />
                <Route path="notifications" element={<Notification />} />
                <Route path="profile" element={<DoctorProfile />} />
              </Route>
            </>
          )}

          {/* 🏪 VENDOR ROUTES */}
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

          {/* 🔁 REDIRECTS */}
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