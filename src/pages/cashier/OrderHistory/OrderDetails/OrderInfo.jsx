import React from "react";

export default function OrderInfo({ order, formatDate }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 text-xs space-y-2">
      <h4 className="font-bold text-slate-900 mb-2">Order Information</h4>
      <div className="flex justify-between text-gray-500">
        <span>Date:</span>
        <span className="font-medium text-slate-800">{formatDate(order?.createdAt)}</span>
      </div>
      <div className="flex justify-between text-gray-500">
        <span>Status:</span>
        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-600 font-bold">
          {order?.status || "COMPLETED"}
        </span>
      </div>
      <div className="flex justify-between text-gray-500">
        <span>Payment Method:</span>
        <span className="font-bold text-slate-800">{order?.paymentType}</span>
      </div>
      <div className="flex justify-between text-gray-500 pt-1 border-t border-slate-200/60">
        <span className="font-medium text-slate-700">Total Amount:</span>
        <span className="font-bold text-slate-900 text-sm">₹{order?.totalAmount?.toFixed(2)}</span>
      </div>
    </div>
  );
}
