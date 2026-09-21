import React from "react";

export default function CustomerInfo({ customer }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 text-xs space-y-2">
      <h4 className="font-bold text-slate-900 mb-2">Customer Information</h4>
      <div className="flex justify-between text-gray-500">
        <span>Name:</span>
        <span className="font-medium text-slate-800 capitalize">{customer?.name || "Guest"}</span>
      </div>
      <div className="flex justify-between text-gray-500">
        <span>Phone:</span>
        <span className="font-medium text-slate-800">{customer?.phone || "—"}</span>
      </div>
    </div>
  );
}