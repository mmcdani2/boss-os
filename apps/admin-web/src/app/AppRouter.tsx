import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import LogsPage from "../pages/LogsPage";
import LogDetailPage from "../pages/LogDetailPage";
import ReimbursementRequestDetailPage from "../pages/ReimbursementRequestDetailPage";
import DivisionsPage from "../pages/DivisionsPage";
import DivisionDetailPage from "../pages/DivisionDetailPage";
import SettingsPage from "../pages/SettingsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <LogsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs/:id"
          element={
            <ProtectedRoute>
              <LogDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reimbursement-requests/:id"
          element={
            <ProtectedRoute>
              <ReimbursementRequestDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/divisions"
          element={
            <ProtectedRoute>
              <DivisionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/divisions/:id"
          element={
            <ProtectedRoute>
              <DivisionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
