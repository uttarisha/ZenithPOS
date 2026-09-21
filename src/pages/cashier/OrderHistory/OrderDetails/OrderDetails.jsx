import React from "react";
import { X, Download, Printer, RotateCcw } from "lucide-react";
import OrderInfo from "./OrderInfo";
import CustomerInfo from "./CustomerInfo";
import OrderItemTable from "./OrderItemTable";

export default function OrderDetails({ order, onClose }) {
  if (!order) return null;

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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 border border-gray-100 max-h-[90vh] flex flex-col">
        {/* Header — pinned, always visible */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-bold text-slate-900">
            Order Details - {order.id}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="px-6 py-5 overflow-y-auto">
          {/* Info Cards Grid */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <OrderInfo order={order} formatDate={formatDate} />
            <CustomerInfo customer={order.customer} />
          </div>

          {/* Order Items Table */}
          <OrderItemTable items={order.items} />
        </div>

        {/* Modal Actions — pinned to bottom */}
        <div className="flex items-center justify-end gap-3 text-xs px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={() => alert("Downloading PDF...")}
            className="px-4 py-2 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Invoice
          </button>
          <button
            onClick={() => alert(`Initiated return for Order #${order.id}`)}
            className="px-4 py-2 rounded-lg bg-[#06392c] text-white font-semibold hover:bg-[#04281f] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Initiate Return
          </button>
        </div>
      </div>
    </div>
  );
}