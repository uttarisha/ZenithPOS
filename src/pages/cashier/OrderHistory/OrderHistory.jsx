import React, { useEffect, useState } from "react";
import { Search, RotateCw, Calendar } from "lucide-react";
import OrderTable from "./OrderTable";
import { getOrderHistory } from "@/lib/orderHistoryApi";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("today");

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getOrderHistory(activeFilter, searchQuery);
      setOrders(data);
    } catch (err) {
      console.error("Failed to load order history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order History</h1>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RotateCw className={`h-3.5 w-3.5 text-gray-500 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#312e81] shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {["today", "this_week", "this_month"].map((f) => {
              const labels = { today: "Today", this_week: "This Week", this_month: "This Month" };
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#312e81] text-white shadow-sm"
                      : "bg-white border border-gray-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {labels[f]}
                </button>
              );
            })}
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-sm">
              <Calendar className="h-3.5 w-3.5 text-gray-500" />
              Custom
            </button>
          </div>
        </div>

        <OrderTable orders={orders} onRefresh={loadOrders} />
      </div>
    </div>
  );
}