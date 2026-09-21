import { Routes, Route } from "react-router-dom";
import CashierDashboardLayout from "../pages/cashier/CashierDashboardLayout";
import CreateOrder from "../pages/cashier/CreateOrder";
import OrderHistory from "../pages/cashier/OrderHistory/OrderHistory";
import RefundPage from "../pages/cashier/Refund/RefundPage";
import CustomerLookup from "../pages/cashier/CustomerManagement/CustomerLookup";
import ShiftSummaryPage from "../pages/cashier/ShiftReport/ShiftSummaryPage";

const CashierRoutes = () => (
  <Routes>
    <Route path="/" element={<CashierDashboardLayout />}>
      <Route index element={<CreateOrder />} />
      <Route path="orders" element={<OrderHistory />} />
      <Route path="customers" element={<CustomerLookup />} />
      <Route path="returns" element={<RefundPage />} />
      <Route path="shift" element={<ShiftSummaryPage />} />
    </Route>
  </Routes>
);

export default CashierRoutes;