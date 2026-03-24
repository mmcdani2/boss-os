import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../routes/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import DivisionModulesPage from "../pages/DivisionModulesPage";
import RefrigerantLogPage from "../pages/RefrigerantLogPage";
import QuickEstimateCalculatorPage from "../pages/QuickEstimateCalculatorPage";
import ReimbursementRequestPage from "../pages/ReimbursementRequestPage";
import SprayFoamJobLogPage from "../pages/SprayFoamJobLogPage";
import MyLogsPage from "../pages/MyLogsPage";
import LogDetailPage from "../pages/LogDetailPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/division/:divisionKey"
            element={
              <ProtectedRoute>
                <DivisionModulesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/refrigerant-log"
            element={
              <ProtectedRoute>
                <RefrigerantLogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quick-estimate-calculator"
            element={
              <ProtectedRoute>
                <QuickEstimateCalculatorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/division/:divisionKey/reimbursement-request"
            element={
              <ProtectedRoute>
                <ReimbursementRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/division/spray-foam/spray-foam-job-log"
            element={
              <ProtectedRoute>
                <SprayFoamJobLogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-logs"
            element={
              <ProtectedRoute>
                <MyLogsPage />
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
