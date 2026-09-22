import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getReturnableOrders } from "@/lib/refundApi";

export default function OrderTable({ onSelectOrder }) {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getReturnableOrders(searchQuery)
      .then(setOrders)
      .catch((err) => console.error(err));
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-100 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 bg-gray-50/50 font-medium">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Date/Time</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment Mode</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-800">{o.id}</td>
                <td className="py-3 px-4 text-gray-500">{o.dateTime}</td>
                <td className="py-3 px-4 text-slate-700">{o.customerName || "—"}</td>
                <td className="py-3 px-4 font-semibold">₹{o.totalAmount?.toFixed(2)}</td>
                <td className="py-3 px-4 text-gray-600">{o.paymentType}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onSelectOrder(o)}
                    className="px-3 py-1.5 bg-[#312e81] text-white rounded-md text-xs font-medium hover:bg-[#1e1b4b] transition-colors"
                  >
                    Select for Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}