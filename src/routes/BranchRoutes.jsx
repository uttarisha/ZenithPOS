import { Routes, Route, Navigate } from "react-router-dom";
import BranchDashboardLayout from "../pages/branch/BranchDashboardLayout";
import BranchDashboard from "../pages/branch/Dashboard/BranchDashboard";
import InventoryList from "../pages/branch/Inventory/InventoryList";
import CashierList from "../pages/branch/BranchEmployees/CashierList";
import BranchOrderHistory from "../pages/branch/Orders/BranchOrderHistory";
import BranchRefunds from "../pages/branch/Refunds/BranchRefunds";
import BranchShiftReports from "../pages/branch/ShiftReports/BranchShiftReports";
import BranchProfile from "../pages/branch/Profile/BranchProfile";

const BranchRoutes = () => (
  <Routes>
    <Route path="/" element={<BranchDashboardLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<BranchDashboard />} />
      <Route path="inventory" element={<InventoryList />} />
      <Route path="employees" element={<CashierList />} />
      <Route path="orders" element={<BranchOrderHistory />} />
      <Route path="refunds" element={<BranchRefunds />} />
      <Route path="shift-reports" element={<BranchShiftReports />} />
      <Route path="profile" element={<BranchProfile />} />
    </Route>
  </Routes>
);

export default BranchRoutes;