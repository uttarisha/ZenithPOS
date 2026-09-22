import React, { useEffect, useState } from "react";
import { Store, CheckCircle2, Clock, Ban, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllStoresApi } from "@/lib/superAdminApi";

export default function SuperAdminDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllStoresApi()
      .then(setStores)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#312e81]" />
      </div>
    );
  }

  const active = stores.filter((s) => s.status === "ACTIVE").length;
  const pending = stores.filter((s) => s.status === "PENDING").length;
  const blocked = stores.filter((s) => s.status === "BLOCKED").length;

  const cards = [
    { label: "Total Stores", value: stores.length, icon: Store },
    { label: "Active", value: active, icon: CheckCircle2 },
    { label: "Pending Approval", value: pending, icon: Clock },
    { label: "Blocked", value: blocked, icon: Ban },
  ];

  const pendingStores = stores.filter((s) => s.status === "PENDING");

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Platform Overview</h1>
        <p className="text-sm text-gray-400">All stores registered on ZenithPOS</p>
      </div>

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
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800">Pending Approvals</h2>
          <Link to="/super-admin/stores" className="text-xs font-semibold text-[#312e81] hover:underline">
            View all stores →
          </Link>
        </div>
        {pendingStores.length === 0 ? (
          <p className="text-sm text-gray-400">No stores awaiting approval.</p>
        ) : (
          <div className="space-y-2">
            {pendingStores.map((store) => (
              <Link
                key={store.id}
                to={`/super-admin/stores/${store.id}`}
                className="flex items-center justify-between text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0 hover:bg-indigo-50/20 -mx-2 px-2 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-700">{store.brand}</p>
                  <p className="text-xs text-gray-400">{store.storeAdmin?.fullName}</p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full border bg-yellow-50 text-yellow-700 border-yellow-200">
                  PENDING
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}