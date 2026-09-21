import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getOrdersByBranchApi } from "@/lib/branchOrderApi";
import useMyBranch from "@/lib/useMyBranch";
import NoBranchNotice from "@/components/NoBranchNotice";

const STATUS_STYLES = {
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function BranchOrderHistory() {
  const { branchId } = useMyBranch();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!branchId) {
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [statusFilter, branchId]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getOrdersByBranchApi(branchId, {
        orderStatus: statusFilter || undefined,
      });
      setOrders(data);
    } catch (err) {
      setOrders([]);
      setError(getErrorMessage(err, "Could not load orders"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order History</h1>
          <p className="text-sm text-gray-400">All orders placed at this branch</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#312e81] bg-white"
        >
          <option value="">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
          {error}
        </div>
      )}

      {!branchId ? (
        <NoBranchNotice />
      ) : loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Cashier</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-indigo-50/20">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">#{order.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {order.customer?.name || "Walk-in"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{order.cashier?.fullName}</td>
                  <td className="px-4 py-3 text-gray-500">{order.paymentType}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        STATUS_STYLES[order.status] || STATUS_STYLES.PENDING
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#312e81]">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}