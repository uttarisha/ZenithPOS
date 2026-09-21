import React from "react";
import { ChevronLeft } from "lucide-react";

export default function OrderDetailSection({ selectedOrder, handleSelectOrder }) {
  return (
    <div className="space-y-4">
      <button
        onClick={() => handleSelectOrder(null)}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Order Search
      </button>

      {/* Main Details Card */}
      <div className="p-5 bg-white border border-gray-100 rounded-xl space-y-4 shadow-sm text-xs">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Order {selectedOrder?.id}</h3>
            <p className="text-gray-400">{selectedOrder?.dateTime}</p>
          </div>
          <span className="px-2 py-0.5 border border-slate-200 rounded text-[10px] font-semibold text-slate-600">
            {selectedOrder?.paymentType}
          </span>
        </div>

        <div>
          <p className="text-gray-400">Customer</p>
          <p className="font-bold text-slate-800">{selectedOrder?.customerName || "Guest"}</p>
          <p className="text-gray-500">{selectedOrder?.customerPhone || "—"}</p>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="font-semibold text-slate-700 mb-1">Order Summary</p>
          <div className="flex justify-between text-gray-500">
            <span>Total Items:</span>
            <span className="font-medium text-slate-800">{selectedOrder?.items?.length || 0}</span>
          </div>
          <div className="flex justify-between text-gray-500 font-bold text-slate-900 text-sm mt-1">
            <span>Order Total:</span>
            <span>₹{selectedOrder?.totalAmount?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Item List Table */}
      <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm text-xs space-y-3">
        <h4 className="font-bold text-slate-900">Order Items</h4>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-normal">
              <th className="pb-2">Item</th>
              <th className="pb-2 text-center">Qty</th>
              <th className="pb-2 text-right">Price</th>
              <th className="pb-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {selectedOrder?.items?.map((item) => (
              <tr key={item.id}>
                <td className="py-2 pr-2 text-slate-800 font-medium">{item.name}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right text-gray-500">₹{item.price?.toFixed(2)}</td>
                <td className="py-2 text-right font-bold text-slate-800">
                  ₹{(item.price * item.quantity)?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}