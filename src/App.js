import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar/sidebar";
import Header from "./Components/Header/Header";

import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import Notification from "./Components/Pages/Notification/Notification";
import OrderDetail from"./Components/Pages/OrderDetail/OrderDetail";
import Dashboard from "./Components/Pages/Dashboard/Dashboard";
import Order from "./Components/Pages/Order/Order"
import Finance from "./Components/Finance/Finance";
import "./App.css"


function App() {
  return (
    <BrowserRouter>
     <div className="app-container" style={{ display: "flex" }}>
        <Sidebar />

        <div className="main-content">
          <Header />
          

          <div className="page-content">
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
 <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Order />
                  </ProtectedRoute>
                }
              />

<Route
path="/OrderDetail"
element={
  <ProtectedRoute>
    <OrderDetail/>
  </ProtectedRoute>
}
/>

<Route path="/notifications" element={
  <ProtectedRoute>
     <Notification />
  </ProtectedRoute>
 } />
 <Route path="/finance" element ={
<ProtectedRoute>
  <Finance/>
</ProtectedRoute>
 }
/>
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;