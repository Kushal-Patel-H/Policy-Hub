import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Welcome from "../pages/Welcome/Welcome";
import Dashboard from "../pages/Dashboard/Dashboard";
import Policies from "../pages/Policies/Policies";
import AddPolicy from "../pages/AddPolicy/AddPolicy";
import Alerts from "../pages/Alerts/Alerts";
import Reminders from "../pages/Reminders/Reminders";
import Profile from "../pages/Profile/Profile";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Welcome />} />
         <Route path="/login" element={<Welcome />} />
      <Route path="/register" element={<Welcome />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/add-policy" element={<AddPolicy />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
  );
}
