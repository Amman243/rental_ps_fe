import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Reservation from "./pages/Reservation";
import Settings from "./pages/Settings";
import FoodList from "./pages/FoodList";
import Games from "./pages/Games";
import Room from "./pages/Room";
import Unit from "./pages/Unit";
import Users from "./pages/Users";
import Customer from "./pages/Customer";
import Membership from "./pages/Membership";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import QuickOrder from "./components/QuickOrder";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="foods" element={<FoodList />} />
          <Route path="games" element={<Games />} />
          <Route path="rooms" element={<Room />} />
          <Route path="customer" element={<Customer />} />
          <Route path="membership" element={<Membership />} />
          <Route path="unit" element={<Unit />} />
          <Route path="user" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="orderfoods" element={<QuickOrder />}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
