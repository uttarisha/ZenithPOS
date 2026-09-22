import React, { useEffect, useState } from "react";
import { ClipboardList, IndianRupee, Users, RotateCcw, Loader2 } from "lucide-react";
import { getTodayOrdersByBranchApi } from "@/lib/branchOrderApi";
import { getRefundsByBranchApi } from "@/lib/branchRefundApi";
import { getBranchEmployeesApi } from "@/lib/employeeApi";
import { getBranchByIdApi } from "@/lib/branchApi";
import useMyBranch from "@/lib/useMyBranch";
import NoBranchNotice from "@/components/NoBranchNotice";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback;

export default function BranchDashboard() {
  const { branchId } = useMyBranch();

  const [branch, setBranch] = useState(null);
  const [todayOrders, setTodayOrders] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [cashierCount, setCashierCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!branchId) {
      setLoading(false);
      return;
    }
    fetchAll();
  }, [branchId]);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [branchData, orders, refundList, cashiers] = await Promise.all([
        getBranchByIdApi(branchId),
        getTodayOrdersByBranchApi(branchId),
        getRefundsByBranchApi(branchId),
        getBranchEmployeesApi(branchId, "ROLE_BRANCH_CASHIER"),
      ]);
      setBranch(branchData);
      setTodayOrders(orders);
      setRefunds(refundList);
      setCashierCount(cashiers.length);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load dashboard data"));
    } finally {
      setLoading(false);
    }
  };

  const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  if (!branchId) {
    return (
      <div className="min-h-screen p-6 md:p-8">
        <NoBranchNotice />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
      </div>
    );
  }

  const cards = [
    { label: "Today's Orders", value: todayOrders.length, icon: ClipboardList },
    { label: "Today's Sales", value: `₹${todaySales.toFixed(2)}`, icon: IndianRupee },
    { label: "Active Cashiers", value: cashierCount, icon: Users },
    { label: "Refunds Logged", value: refunds.length, icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          {branch?.name || "Branch"} Dashboard
        </h1>
        <p className="text-sm text-gray-400">{branch?.address}</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-[#312e81]" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-3">Recent Orders Today</h2>
        {todayOrders.length === 0 ? (
          <p className="text-sm text-gray-400">No orders recorded yet today.</p>
        ) : (
          <div className="space-y-2">
            {todayOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0"
              >
                <div>
                  <p className="font-medium text-slate-700">
                    {order.customer?.name || "Walk-in Customer"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleTimeString()} · {order.cashier?.fullName}
                  </p>
                </div>
                <span className="font-bold text-[#312e81]">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}