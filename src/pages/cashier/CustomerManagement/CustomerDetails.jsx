import React from "react";
import { ShoppingBag, IndianRupee } from "lucide-react";
import PurchaseHistory from "./PurchaseHistory";

export default function CustomerDetails({ customer }) {
  if (!customer) {
    return (
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-xs text-slate-400">
        Select a customer to view details
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      {/* Detail Header */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-800">{customer.name}</h2>
        <p className="text-xs text-slate-500">{customer.email}</p>
        <p className="text-xs text-slate-400 font-mono mt-0.5">{customer.phone}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-slate-600">Total Orders</p>
          <div className="flex items-center gap-2 text-[#312e81] font-bold text-lg">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-slate-800">{customer.totalOrders}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-slate-600">Total Spent</p>
          <div className="flex items-center gap-1 text-[#312e81] font-bold text-lg">
            <IndianRupee className="w-5 h-5" />
            <span className="text-slate-800">{customer.totalSpent.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <PurchaseHistory history={customer.history || []} />
    </div>
  );
}