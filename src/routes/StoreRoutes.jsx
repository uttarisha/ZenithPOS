import { Routes, Route, Navigate } from "react-router-dom";
import StoreDashboardLayout from "../pages/store/StoreDashboardLayout";
import StoreDashboard from "../pages/store/Dashboard/StoreDashboard";
import RevenueDashboard from "../pages/store/Dashboard/RevenueDashboard"; // adjust path to where the file lives
import BranchList from "../pages/store/Branches/BranchList";
import ProductList from "../pages/store/Catalog/ProductList";
import StoreEmployeeList from "../pages/store/Employees/StoreEmployeeList";
import StoreProfile from "../pages/store/Profile/StoreProfile";

const StoreRoutes = () => (
  <Routes>
    <Route path="/" element={<StoreDashboardLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<StoreDashboard />} />
      <Route path="revenue" element={<RevenueDashboard />} />
      <Route path="branches" element={<BranchList />} />
      <Route path="catalog" element={<ProductList />} />
      <Route path="employees" element={<StoreEmployeeList />} />
      <Route path="profile" element={<StoreProfile />} />
    </Route>
  </Routes>
);

export default StoreRoutes;