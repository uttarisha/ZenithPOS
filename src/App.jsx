import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import StoreRoutes from './routes/StoreRoutes'
import BranchRoutes from './routes/BranchRoutes'
import CashierRoutes from './routes/CashierRoutes'
import AdminRoutes from './routes/AdminRoutes'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/cashier/*"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BRANCH_CASHIER"]}>
            <CashierRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/store/*"
        element={
          <ProtectedRoute allowedRoles={["ROLE_STORE_ADMIN"]}>
            <StoreRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/branch/*"
        element={
          <ProtectedRoute allowedRoles={["ROLE_BRANCH_MANAGER"]}>
            <BranchRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/*"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App