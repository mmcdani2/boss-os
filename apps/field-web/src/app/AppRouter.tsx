import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "../features/auth/pages/LoginPage";
import HomePage from "../features/home/pages/HomePage";
import DivisionModulesPage from "../features/launcher/pages/DivisionModulesPage";
import RefrigerantLogPage from "../features/refrigerant/pages/RefrigerantLogPage";
import QuickEstimateCalculatorPage from "../features/quick-estimate/pages/QuickEstimateCalculatorPage";
import ReimbursementRequestPage from "../features/reimbursements/pages/ReimbursementRequestPage";
import SprayFoamJobLogPage from "../features/spray-foam/pages/SprayFoamJobLogPage";
import MyLogsPage from "../features/logs/pages/MyLogsPage";
import LogDetailPage from "../features/logs/pages/LogDetailPage";

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



