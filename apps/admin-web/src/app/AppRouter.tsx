import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import PermissionRoute from "./routes/PermissionRoute";
import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import LogsPage from "../features/reports/pages/LogsPage";
import LogDetailPage from "../features/reports/pages/LogDetailPage";
import ReimbursementRequestDetailPage from "../features/reports/pages/ReimbursementRequestDetailPage";
import DivisionsPage from "../features/divisions/pages/DivisionsPage";
import DivisionDetailPage from "../features/divisions/pages/DivisionDetailPage";
import SettingsPage from "../features/settings/pages/SettingsPage";
import UsersPage from "../features/users/pages/UsersPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <PermissionRoute adminOnly>
                <DashboardPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <PermissionRoute adminOnly>
                <LogsPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/logs/:id"
            element={
              <PermissionRoute adminOnly>
                <LogDetailPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/reimbursement-requests/:id"
            element={
              <PermissionRoute adminOnly>
                <ReimbursementRequestDetailPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/divisions"
            element={
              <PermissionRoute adminOnly>
                <DivisionsPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/divisions/:id"
            element={
              <PermissionRoute adminOnly>
                <DivisionDetailPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PermissionRoute adminOnly>
                <UsersPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PermissionRoute adminOnly>
                <SettingsPage />
              </PermissionRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
