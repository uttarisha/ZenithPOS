import React, { useState } from "react";
import { Eye, Printer, RotateCcw, CheckCircle2 } from "lucide-react";
import OrderDetails from "./OrderDetails/OrderDetails";
import { updateOrderStatusApi } from "@/lib/orderHistoryApi";

export default function OrderTable({ orders = [], onRefresh }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleMarkCompleted = async (id) => {
    setUpdatingId(id);
    try {
      await updateOrderStatusApi(id, "COMPLETED");
      onRefresh?.();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-100 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 font-semibold bg-gray-50/50">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Date/Time</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment Mode</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{o.id}</td>
                  <td className="py-3.5 px-4 text-gray-600">{formatDate(o.createdAt)}</td>
                  <td className="py-3.5 px-4 text-slate-800 font-medium capitalize">
                    {o.customer?.name || "Guest"}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₹{o.totalAmount?.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{o.paymentType}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        o.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-slate-600">
                      {o.status === "PENDING" && (
                        <button
                          onClick={() => handleMarkCompleted(o.id)}
                          disabled={updatingId === o.id}
                          className="hover:text-emerald-800 p-1 rounded transition-colors disabled:opacity-50"
                          title="Mark as Completed"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="hover:text-emerald-800 p-1 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="hover:text-emerald-800 p-1 rounded transition-colors"
                        title="Print Invoice"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => alert(`Initiate Return for Order #${o.id}`)}
                        className="hover:text-emerald-800 p-1 rounded transition-colors"
                        title="Initiate Return"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  );
}