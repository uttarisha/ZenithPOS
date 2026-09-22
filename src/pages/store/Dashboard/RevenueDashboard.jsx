import React, { useEffect, useState } from "react";
import { Loader2, TrendingUp, Store, Receipt, ArrowDownCircle } from "lucide-react";
import { getStoreRevenueSummaryApi } from "@/lib/storeApi";

const money = (n) => `₹${(n ?? 0).toFixed(2)}`;

function SummaryCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${tone}`}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-xs font-semibold text-gray-500">{label}</p>
      </div>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function RevenueDashboard() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStoreRevenueSummaryApi();
      setSummary(data);
    } catch (err) {
      setError(err.message || "Could not load revenue summary.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-[#312e81]" />
        Loading revenue data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-3 bg-white rounded-xl border border-gray-200">
        <p className="text-red-600 text-sm font-semibold">{error}</p>
        <button
          onClick={load}
          className="px-4 py-2 bg-[#312e81] hover:bg-[#1e1b4b] text-white rounded-lg text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  const branches = summary?.branches || [];
  const maxRevenue = Math.max(1, ...branches.map((b) => b.netRevenue || 0));

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Revenue Overview</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Branch-wise sales and revenue across your store.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={TrendingUp}
          label="Total Sales"
          value={money(summary?.totalSales)}
          tone="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard
          icon={ArrowDownCircle}
          label="Total Refunds"
          value={money(summary?.totalRefunds)}
          tone="bg-red-50 text-red-600"
        />
        <SummaryCard
          icon={Receipt}
          label="Net Revenue"
          value={money(summary?.netRevenue)}
          tone="bg-indigo-50 text-indigo-600"
        />
        <SummaryCard
          icon={Store}
          label="Total Orders"
          value={summary?.totalOrders ?? 0}
          tone="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Branch breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Revenue by Branch</h3>

        {branches.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            No branches found for your store.
          </p>
        ) : (
          <div className="space-y-4">
            {branches.map((b) => (
              <div key={b.branchId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{b.branchName}</span>
                  <span className="text-gray-500">
                    {b.totalOrders} orders ·{" "}
                    <span className="font-bold text-slate-900">{money(b.netRevenue)}</span>
                  </span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#312e81] rounded-full transition-all"
                    style={{ width: `${Math.max(4, ((b.netRevenue || 0) / maxRevenue) * 100)}%` }}
                  />
                </div>
                {b.totalRefunds > 0 && (
                  <p className="text-[11px] text-red-500">
                    -{money(b.totalRefunds)} in refunds
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table view */}
      {branches.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 font-semibold bg-gray-50/50">
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4 text-right">Orders</th>
                <th className="py-3 px-4 text-right">Sales</th>
                <th className="py-3 px-4 text-right">Refunds</th>
                <th className="py-3 px-4 text-right">Net Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {branches.map((b) => (
                <tr key={b.branchId} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-semibold text-slate-800">{b.branchName}</td>
                  <td className="py-3 px-4 text-right text-slate-700">{b.totalOrders}</td>
                  <td className="py-3 px-4 text-right text-slate-700">{money(b.totalSales)}</td>
                  <td className="py-3 px-4 text-right text-red-600">{money(b.totalRefunds)}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {money(b.netRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}