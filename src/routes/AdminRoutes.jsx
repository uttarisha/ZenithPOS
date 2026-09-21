import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminDashboardLayout from "../pages/superAdmin/SuperAdminDashboardLayout";
import SuperAdminDashboard from "../pages/superAdmin/Dashboard/SuperAdminDashboard";
import StoreList from "../pages/superAdmin/Stores/StoreList";
import StoreDetails from "../pages/superAdmin/Stores/StoreDetails";
import AllBranchesView from "../pages/superAdmin/Branches/AllBranchesView";
import UserDetails from "../pages/superAdmin/Users/UserDetails";
import AdminProfile from "../pages/superAdmin/Profile/AdminProfile";

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<SuperAdminDashboardLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<SuperAdminDashboard />} />
      <Route path="stores" element={<StoreList />} />
      <Route path="stores/:id" element={<StoreDetails />} />
      <Route path="branches" element={<AllBranchesView />} />
      <Route path="users" element={<UserDetails />} />
      <Route path="profile" element={<AdminProfile />} />
    </Route>
  </Routes>
);

export default AdminRoutes;