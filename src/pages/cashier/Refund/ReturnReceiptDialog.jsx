import React, { useState } from "react";
import { X } from "lucide-react";
import { processRefundApi } from "@/lib/refundApi";

export default function ReturnReceiptDialog({
  selectedOrder,
  returnItems,
  returnReason,
  refundMethod,
  totalRefundAmount,
  onClose,
  onSuccess,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmRefund = async () => {
    setIsSubmitting(true);
    try {
      await processRefundApi({
        orderId: selectedOrder.id,
        items: returnItems,
        reason: returnReason,
        refundMethod,
        totalRefundAmount,
      });
      alert("Refund processed successfully!");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to process refund.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative text-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h3 className="font-bold text-slate-900 text-sm">Confirm Refund</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="text-center py-2">
          <p className="text-gray-400">Refund Amount</p>
          <h2 className="text-2xl font-black text-slate-900">₹{totalRefundAmount.toFixed(2)}</h2>
        </div>

        <div className="space-y-1 bg-slate-50 p-3 rounded-lg text-gray-600">
          <p className="font-bold text-slate-800 mb-1">Refund Details:</p>
          <p>Order ID: <span className="font-semibold text-slate-800">{selectedOrder?.id}</span></p>
          <p>Customer: <span className="font-semibold text-slate-800">{selectedOrder?.customerName || "Guest"}</span></p>
          <p>Refund Method: <span className="font-semibold text-slate-800">{refundMethod}</span></p>
          <p>Return Reason: <span className="font-semibold text-slate-800">{returnReason}</span></p>
        </div>

        <div>
          <p className="font-bold text-slate-800 mb-1">Items Being Returned:</p>
          <ul className="space-y-0.5 text-gray-600">
            {returnItems.map((item) => (
              <li key={item.id} className="truncate">
                {item.name} x {item.returnQty} (₹{(item.price * item.returnQty).toFixed(2)})
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-1/2 py-2 border border-gray-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleConfirmRefund}
            className="w-1/2 py-2 bg-[#312e81] hover:bg-[#1e1b4b] text-white font-bold rounded-lg transition-colors"
          >
            {isSubmitting ? "Processing..." : "Confirm Refund"}
          </button>
        </div>
      </div>
    </div>
  );
}